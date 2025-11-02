<!DOCTYPE html>
<html>

    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <title>{{ env('APP_NAME') }}</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <link rel="icon" type="image/png"
            href="{{ settings()->get('logo') ? '/storage/' . settings()->get('logo') : asset('assets/images/favicon.png') }}"
            sizes="16x16">
        <!-- remix icon font css  -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/remixicon.css">
        <!-- BootStrap css -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/bootstrap.min.css">
        <!-- Apex Chart css -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/apexcharts.css">
        <!-- Text Editor css -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/editor-katex.min.css">
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/editor.atom-one-dark.min.css">
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/editor.quill.snow.css">
        <!-- Date picker css -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/flatpickr.min.css">
        <!-- Calendar css -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/full-calendar.css">
        <!-- Vector Map css -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/jquery-jvectormap-2.0.5.css">
        <!-- Popup css -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/magnific-popup.css">
        <!-- Slick Slider css -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/slick.css">
        <!-- prism css -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/prism.css">
        <!-- file upload css -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/file-upload.css">

        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/audioplayer.css">
        <link rel="stylesheet" href="{{ asset('assets') }}/css/lib/animate.min.css">
        <!-- main css -->
        <link rel="stylesheet" href="{{ asset('assets') }}/css/style.css">
        <link rel="stylesheet" href="{{ asset('assets') }}/css/extra.css">
        <style>
            .dataTable {
                width: 100% !important;
                margin-top: 20px !important;
            }

            .swal2-title {
                font-size: 1.875em !important;
            }
        </style>
        @routes
        @viteReactRefresh
        @vite('resources/js/App.jsx')
        @inertiaHead
    </head>

    <body>
        @inertia
    </body>

</html>
