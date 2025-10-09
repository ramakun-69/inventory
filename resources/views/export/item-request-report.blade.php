<table>
    <thead>
        <tr>
            <th>{{__("No")}}</th>
            <th>{{ __("Request Number") }}</th>
            <th>{{ __("Request Date") }}</th>
            <th>{{ __("Requested By") }}</th>
            <th>{{ __("Division") }}</th>
            <th>{{ __("Purpose") }}</th>
            <th>{{ __("Status") }}</th>
            {{-- <th>{{ __("Item Name") }}</th>
            <th>{{ __("Quantity") }}</th>
            <th>{{ __("Unit") }}</th> --}}
        </tr>
    </thead>
    <tbody>
        @foreach ($data as $item)
            <tr>
                <td>{{ $loop->iteration }}</td>
                <td>{{ $item->request_number }}</td>
                <td>{{ $item->request_date->format('d/m/Y') }}</td>
                <td>{{ $item->user->name }}</td>
                <td>{{ $item->user->division->name ?? '-' }}</td>
                <td>{{ $item->purpose }}</td>
                <td>{{ $item->status }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
