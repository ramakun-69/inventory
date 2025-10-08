<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

trait ResponseOutput
{
    function responseErrorValidate($validator)
    {
        return response()->json([
            'message' => __('Validation Failed') . "!!",
            'data' => $validator
        ], 422);
    }
    function responseUnauthorized($message)
    {
        return response()->json([
            'message' => $message,
            'data' => []
        ], 401);
    }
    function safeExecute(callable $callback)
    {
        try {
            return $callback();
        } catch (\Throwable $th) {
            DB::rollBack();
            $errorMessage = config('app.debug')
                ? $th->getMessage() . " | " . $th->getFile() . " | " . $th->getLine()
                : __("Server Error");
            return $this->responseFailed($errorMessage);
        }
    }

    function safeInertiaExecute(callable $callback)
    {
        try {
            return $callback();
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $th) {
            DB::rollBack();
            $errorMessage = config('app.debug')
                ? $th->getMessage() . " | " . $th->getFile() . " | " . $th->getLine()
                : __('An Unexpected Error Occurred');

            return redirect()->back()->with([
                'error' => $errorMessage
            ]);
        }
    }
    function responseFailed($failedMsg)
    {
        return response()->json([
            'message' => $failedMsg,
        ], 500);
    }
    function responseSuccess($message, $data = [])
    {

        return response()->json([
            'message' => $message,
            'data' =>  $data
        ], 200);
    }
    function responseConflict()
    {
        return response()->json([
            'message' => "Failed",
            'data' => []
        ], 409);
    }
    function responseNotFound($message = "Data Not Found", $data = [])
    {
        return response()->json([
            'message' => $message,
            'data' => $data
        ], 404);
    }
}
