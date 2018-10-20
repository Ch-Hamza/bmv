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
            { responsivePriority: 2, targets: 19 },
            { responsivePriority: 1, targets: 21 },
            {
                "targets": [ 17,18 ],
                "visible": false,
                "searchable": false,
            },
            { "orderable": false, "targets": 21 },
            {
                "targets": [ 20 ],
                "render": function ( data, type, row, meta ) {
                	
                    map = 	'<div class="row">'+
                    	    	'<div class="col-sm-6">Longitude = '+data['longitude']+'</div>'+
                    	   		'<div class="col-sm-6">Lattitude = '+data['lattitude']+'</div>'+
	                      	'</div>'
	                      	/*'<div class="row">'+
	                      		'<div class="map-container map-marker-simple"></div>'+
	                      		
	                      		'<script>'+
	                      			'$(function() {'+

	                      				// Setup map
										'function initialize() {'+

											// Set coordinates
											'var myLatlng = new google.maps.LatLng('+data['lattitude']+', '+data['longitude']+');'+

											// Options
											'var mapOptions = {'+
												'zoom: 18,'+
												'center: myLatlng'+
											'};'+

											// Apply options
											'map = new google.maps.Map($(\'.map-marker-simple\')[0], mapOptions);'+

											// Add marker
											'var marker = new google.maps.Marker({'+
												'position: myLatlng,'+
												'map: map'+
											'});'+

										'};'+

										// Load map
										'initialize();'+

									'});'+
      								
							    '</script>'+
	                      	'</div>'*/
                    ;
                    return map;
                },
            },
            {
                "targets": [ 18 ],
                "render": function ( data, type, row, meta ) {
                    gallery = '<div class="row">';

                    data.forEach(function(currentValue, index){

                        gallery = gallery +
                        '<div class="col-lg-1 col-md-1 col-sm-1">'+
                            '<img src="/uploads/img/critere_images/'+currentValue['image']+'" alt="" data-popup="tooltip" title="'+currentValue['title_en']+'">'+
                        '</div>';
                    });
                    gallery = gallery + '</div>';
                    return gallery;
                },
            },
            {
                "targets": [ 17 ],
                "render": function ( data, type, row, meta ) {
                    gallery = '<div class="row">';

                    data.forEach(function(currentValue, index){

                        gallery = gallery +
                        '<div class="col-lg-1 col-md-1 col-sm-1">'+
                            '<img src="/uploads/img/category_images/'+currentValue['image']+'" alt="" data-popup="tooltip" title="'+currentValue['title_en']+'">'+
                        '</div>';
                    });
                    gallery = gallery + '</div>';
                    return gallery;
                },
            },
            {
                "targets": [ 16 ],
                "render": function ( data, type, row, meta ) {
                    gallery = '<div class="row">';

                    data.forEach(function(currentValue, index){

                        gallery = gallery +
                        '<div>'+
                            '<div class="thumbnail">'+
                                '<div class="thumb">'+
                                    '<img src="/uploads/img/museum_images/'+currentValue['image']+'" style="object-fit: cover; height: 230px" alt="">'+
                                    '<div class="caption-overflow">'+
                                        '<span>'+
                                            '<a href="/uploads/img/museum_images/'+currentValue['image']+'" data-popup="lightbox" rel="gallery" class="btn border-white text-white btn-flat btn-icon btn-rounded"><i class="icon-zoomin3"></i></a>'+
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
        "ajax": "http://localhost:8000/api/paginate",
        "sAjaxDataProp": "data",
        "columns":[
            {"data": "name"},
            {"data": "schedule"},
            {"data": "price"},
            {"data": "rue"},
            {"data": "code_postal"},
            {"data": "canton"},
            {"data": "place"},
            {"data": "description_fr"},
            {"data": "description_en"},
            {"data": "description_it"},
            {"data": "description_de"},
            {"data": "directions"},
            {"data": "phone"},
            {"data": "fax"},
            {"data": "email"},
            {"data": "website"},
            {"data": "images"},
            {"data": "categories"},
            {"data": "criteres"},
            {"data": "enabled"},
            {"data": "location"},
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
