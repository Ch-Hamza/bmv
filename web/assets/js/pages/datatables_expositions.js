/* ------------------------------------------------------------------------------
*
*  # Basic datatables
*
*  Specific JS code additions for datatable_basic.html page
*
*  Version: 1.0
*  Latest update: Aug 1, 2015
*
* ---------------------------------------------------------------------------- */

$(function() {
    // Table setup
    // ------------------------------

    // Setting datatable defaults
    $.extend( $.fn.dataTable.defaults, {
        autoWidth: false,
        columnDefs: [
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: 1 },
            { responsivePriority: 2, targets: 2 },
            { responsivePriority: 2, targets: 3 },
            { responsivePriority: 2, targets: 6 },
            { responsivePriority: 1, targets: 7 },
            {
                "targets": [ 5 ],
                "visible": false,
                "searchable": false,
            },
            { "orderable": false, "targets": 7 },
            {
                "targets": [ 5 ],
                "render": function ( data, type, row, meta ) {
                    gallery = '<div class="row">';

                    data.forEach(function(currentValue, index){

                        gallery = gallery +
                        '<div>'+
                            '<div class="thumbnail">'+
                                '<div class="thumb">'+
                                    '<img src="/uploads/img/exposition_images/'+currentValue['image']+'" style="object-fit: cover; height: 230px" alt="">'+
                                    '<div class="caption-overflow">'+
                                        '<span>'+
                                            '<a href="/uploads/img/exposition_images/'+currentValue['image']+'" data-popup="lightbox" rel="gallery" class="btn border-white text-white btn-flat btn-icon btn-rounded"><i class="icon-zoomin3"></i></a>'+
                                        '</span>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                    });
                    gallery = gallery + '</div>';
                    return gallery;
                },
            },
        ],
        dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
        language: {
            search: '<span>Filter:</span> _INPUT_',
            lengthMenu: '<span>Show:</span> _MENU_',
            paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' }
        },
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal( {
                    header: function ( row ) {
                        var data = row.data();
                        return 'Details for '+data['name'];
                    }
                } ),
                renderer: $.fn.dataTable.Responsive.renderer.tableAll( {
                    tableClass: 'table'
                } )
            }
        },
        "processing": true,
        "serverSide": true,
        "ajax": "http://localhost:8000/api/expositions/paginate",
        "sAjaxDataProp": "data",
        "columns":[
            {"data": "name"},
            {"data": "start"},
            {"data": "finish"},
            {"data": "museum"},
            {"data": "description"},
            {"data": "images"},
            {"data": "enabled"},
            {"data": "links"},
        ],

        drawCallback: function () {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
        },
        preDrawCallback: function() {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
        }
    });

    // Basic datatable
    $('.datatable-basic').DataTable();

    // Alternative pagination
    $('.datatable-pagination').DataTable({
        pagingType: "simple",
        language: {
            paginate: {'next': 'Next &rarr;', 'previous': '&larr; Prev'}
        }
    });


    // Datatable with saving state
    $('.datatable-save-state').DataTable({
        stateSave: true
    });


    // Scrollable datatable
    $('.datatable-scroll-y').DataTable({
        autoWidth: true,
        scrollY: 300
    });

    // External table additions
    // ------------------------------

    // Add placeholder to the datatable filter option
    $('.dataTables_filter input[type=search]').attr('placeholder','Type to filter...');


    // Enable Select2 select for the length option
    $('.dataTables_length select').select2({
        minimumResultsForSearch: Infinity,
        width: 'auto'
    });
    
});
