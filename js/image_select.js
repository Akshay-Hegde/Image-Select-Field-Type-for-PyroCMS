(function($){
    var isSingle = false;
    
    function init(){
        $('.is_image_container').each(function(i, dom){
            var json_value = $(dom).find('.is_input_field input').val();
            var content = '';

            isSingle = ($(dom).find('#wcept_is_single').val() == "1")? true: false;

            if(json_value.length > 0){
                var data = $.parseJSON(json_value);

                if(isSingle){
                    $.each(data, function(k, v){
                        if(v.path != null)
                            add_to_list(dom, v.id, v.path.replace('{{ url:site }}', SITE_URL), false, true);
                    });
                }else{
                    $.each(data, function(k, v){
                        var selected = false;
                        if(typeof(v.top) != 'undefined'){
                            selected = v.top;
                        }

                        if(v.path != null)
                            add_to_list(dom, v.id, v.path.replace('{{ url:site }}', SITE_URL), selected);
                    });
                }
            }
        });
    }
    
    function update_output(parentID){
        var data = [];
        
        $('#'+parentID).find('#is_selected_images ul#is_sortable li').each(function(idx, el){
            var obj = new Object();
            
            var id = $(this).attr('id');
            var radio = $(this).find('#is_top_image');
            
            id = id.replace('is_li-', '');
            
            obj.id = id;
            if(radio.is(':checked')){
                obj.top = true;
            }
            
            data.push(obj);
        });
        
        $('#'+parentID).find('.is_input_field input').val( JSON.stringify(data) );
    }
    
    function add_to_list(dom, id, path, isTop, single){
        if(typeof(single) != 'undefined' && single){
            var content = '<li id="is_li-'+id+'"><a href="#" class="is_remove">X</a><img src="'+path+'" /></li>';

            if($(dom).find('#is_li-'+id).length <= 0){
                $(dom).find('#is_selected_images #is_sortable').append(content);
            }
        }else{
            if(typeof(isTop) == 'undefined'){
                isTop = false;
            }
            var content = '<li id="is_li-'+id+'"><label><input type="radio" id="is_top_image" name="is_top_image" class="is_radio" value="'+id+'"'+(isTop? 'checked': '')+' /> Top Image</label><a href="#" class="is_remove">X</a><img src="'+path+'" /></li>';

            if($(dom).find('#is_li-'+id).length <= 0){
                $(dom).find('#is_selected_images #is_sortable').append(content);
            }
        }
    }
    
    function generate_block(id, name, path, single){
        if(typeof(single) != 'undefined'){
            if(single){
                return '<div class="wcept_is_container" style="float:left; position: relative;"><label><input type="radio" name="wcept_is_radio" class="is_checkbox" value="'+id+'" /><div class="is_image_box"><img src="'+path+'" /></div></label><span style="left: 5%; bottom: 10px; width: 90%; display: block; text-align: center; position: absolute; color: #fff; background: rgba(0, 0, 0, 0.7); font-size: 95%;">'+name+'</span></div>';
            }
        }
        return '<div class="wcept_is_container" style="float:left; position: relative;"><label><input type="checkbox" class="is_checkbox" value="'+id+'" /><div class="is_image_box"><img src="'+path+'" /></div></label><span style="left: 5%; bottom: 10px; width: 90%; display: block; text-align: center; position: absolute; color: #fff; background: rgba(0, 0, 0, 0.7); font-size: 95%;">'+name+'</span></div>';
    }
    function update_content(content){
        $('.image_grid').html(content);
        
        $('.is_image_box').click(function(){
            
        });
    }
    function get_folder_content(parentID){
        $.ajax({
            type: "POST",
            url: '/admin/files/folder_contents',
            data: {parent: parentID},
            dataType: 'json',
            success: function(result){
                var content = '';
                
                if(result.status){
                    if(result.data.file.length > 0){
                        var i = 0;
                        
                        $.each(result.data.file, function(k, v){
                            if(v.type == 'i'){
                                content += generate_block(v.id, v.name, v.path.replace('{{ url:site }}', SITE_URL), isSingle);
                            }
                        });
                        
                        if(content.length == 0){
                            content = 'No Image Found.';
                        }
                    }else{
                        content = 'No Image Found.';
                    }
                }else{
                    content = result.message;
                }
                
                update_content(content);
            }
        });
        
    }
    $(function(){
        var currentId = '';
        
        init();
        
        $(".is_select_button").click(function(e){
            e.preventDefault();
            //var parentDom = $('#'+$(this).data('parentid'));
            currentId = $(this).data('parentid');
            
            $.fn.colorbox(
                {
                    overlayClose: false,
                    inline:true, href:'#is_colorbox', height: "85%", width: "80%",
                    onLoad: function(){
                        $('#cboxClose').hide();
                    },
                    onOpen: function(){


                    }
                }
            );
        });
        /*$(".is_select_button").colorbox(
            {
                overlayClose: false,
                inline:true, href:'#is_colorbox', height: "85%", width: "80%",
                onLoad: function(){
                    $('#cboxClose').hide();
                },
                onOpen: function(){
                    
                    
                }
            }
        );*/
            
        $("#folder_select").change(function(e){
            if($(this).val() != ''){
                var parentId = $(this).val();
                get_folder_content(parentId);
            }
        });
        
        $(".is_add_button").click(function(e){
            e.preventDefault();
            var parentDom = $('#'+currentId);
            
            if(isSingle){
                parentDom.find('#is_sortable').empty();
                $('.image_grid .wcept_is_container').each(function(idx, el){
                    if($(this).find('.is_checkbox').is(':checked')){
                        var path = $(this).find('img').attr('src');
                        var id = $(this).find('.is_checkbox').val();

                        add_to_list(parentDom, id, path, false, true);
                        
                        $(this).find('.is_checkbox').prop('checked', false);
                        
                        $.colorbox.close();
                    }
                });
            }else{
                $('.image_grid .wcept_is_container').each(function(idx, el){
                    if($(this).find('.is_checkbox').is(':checked')){
                        var path = $(this).find('img').attr('src');
                        var id = $(this).find('.is_checkbox').val();

                        add_to_list(parentDom, id, path);

                        $(this).removeClass('border_blue');
                        $(this).find('.is_checkbox').prop('checked', false);
                    }
                });
            }
            update_output(currentId);
            
            $('.is_radio').change(function(e){
                update_output(currentId);
            });
            $('.is_remove').click(function(e){
                e.preventDefault();
                $(this).parent('li').remove();

                update_output(currentId);
            });
        });
        
        $("#is_cancel_button").click(function(e){
            e.preventDefault();
            $('#cboxClose').click();
        });
        
        $('.is_radio').change(function(e){
            var parentID = $(this).parent().parent().parent().parent().parent().attr('id');
            update_output(parentID);
        });
        
        $('.is_remove').click(function(e){
            e.preventDefault();
            var parentID = $(this).parent().parent().parent().parent().attr('id');
            
            $(this).parent('li').remove();
            
            update_output(parentID);
        });
        
        $("#is_sortable").sortable({
            placeholder: "ui-is_sortable-state-highlight",
            update: function(ev, ui){
                
                update_output($(this).parent().parent().attr('id'));
            }
        });
    });
})(jQuery);