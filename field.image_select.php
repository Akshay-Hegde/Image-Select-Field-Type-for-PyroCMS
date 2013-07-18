<?php defined('BASEPATH') or exit('No direct script access allowed');

/**
 * Image Select Field Type
 *
 * @package		Addons\Field Types
 * @author		Kingsley@Web Concept
 * @license		MIT License
 * @link		http://wcept.com
 */
class Field_image_select
{
	public $field_type_slug    = 'image_select';
	public $db_col_type        = 'text';
	public $version            = '1.0.0';
	public $author             = array('name'=>'Kingsley@Web Concept', 'url'=>'http://wcept.com/');
	public $custom_parameters  = array('single');

	// --------------------------------------------------------------------------

	public function __construct()
	{
		$this->CI =& get_instance();
		$this->CI->load->library('files/files');
		$this->CI->load->model('files/file_folders_m');
		$this->CI->load->library('files/files');
	}
        
        public function pre_output_plugin($input, $params, $row_slug){
            $single = ( ! isset($params['single'])) ? '0' : $params['single'];
            $data = json_decode($input);
            $result = array();
            //print_r($input);
            
            if($single == '0'){
                foreach($data as $image){
                    if(isset($image->top) && $image->top){
                        $file = Files::get_file($image->id);
                        if(isset($file['data']) && isset($file['data']->path)){
                            $result['top'] = $image->id;
                            //$result['top'] = $file['data']->path;
                        }
                    }else{
                        $file = Files::get_file($image->id);
                        if(isset($file['data']) && isset($file['data']->path)){
                            $result['images'][]->imageid = $image->id;
                            //$result['subimages'][]->url = $file['data']->path;
                        }
                    }
                }
            }else{
                return $data[0]->id;
            }
		return $result;
	}
        
        public function pre_output($input, $params){
            $single = ( ! isset($params['single'])) ? '0' : $params['single'];
            $data = json_decode($input);
            
            return $data[0]->id;
        }

	/**
	 * Output form input
	 *
	 * @param	array
	 * @param	array
	 * @return	string
	 */
        
        public function form_output($data, $entry_id, $field){
            $options['name']  = $data['form_slug'];
            $options['id']    = $data['form_slug'];
            $values = $data['value'];
            
            if(!empty($data['value'])){
                $values = json_decode($data['value']);
                
                foreach($values as $value){
                    $file = Files::get_file($value->id);
                    $value->path = $file['data']->path;
                }
                //Files::get_file();
                
                $values = json_encode($values);
            }
            
            $empty_select->id = '';
            $empty_select->name = '';
            
            $folders = $this->CI->file_folders_m->get_all();
            array_unshift($folders, $empty_select);
            
            foreach($folders as $folder){
                if($folder->parent_id != 0){
                    $folder->name = ' » '.$folder->name;
                }
            }
            $folder_select = array_for_select($folders, 'id', 'name');
            
            $uniqueid = 'a'.uniqid();
            $container_open = '<div class="is_image_container" id="'.$uniqueid.'">';
            $container_close = '</div>';
            
            if(isset($data['custom']['single']) && $data['custom']['single'] == '1'){
                $add_button = '<button class="btn blue is_add_button" data-parentid="'.$uniqueid.'" value="add" name="btnAction" style="float:right; margin-right: 10px;"><span>Add Image</span></button>';
                $select_button = '<button class="btn blue is_select_button" data-parentid="'.$uniqueid.'" value="select" name="btnAction"><span>Select Image</span></button>';
                $cancel_button = '<button class="btn gray cancel" id="is_cancel_button" value="cancel" name="btnAction" style="float:right;"><span>Close</span></button>';

                $selected_area = '<div id="is_selected_images"><ul id="is_sortable"></ul><br style="clear: both;" /></div>';
                $input_field = '<div class="is_input_field"><input type="text" id="'.$data['form_slug'].'" name="'.$data['form_slug'].'" value="'.htmlentities($values).'" readOnly /></div>';
                $is_single = '<input type="hidden" id="wcept_is_single" value="1" />';

                $popup_file_view = '<div style="display: none;"><div id="is_colorbox" class="'.$uniqueid.'-cb" style="height: 100%;">
                        <div style="height: 40px; width: 96%; top: 0; background: #fff; position: absolute; z-index: 100000;">'.form_dropdown('folder_select', $folder_select, '', 'id="folder_select"').'</div>
                        <div class="image_grid" style="height: 100%; padding-top: 40px; overflow: auto; background: #fff; box-sizing:border-box; -moz-box-sizing:border-box;"></div>
                        <div style="height: 38px; width: 96%; bottom: 0; background: #fff; position: absolute;">'.$cancel_button.$add_button.'</div>
                    </div></div>';
                
            }else{ // multi select
                $add_button = '<button class="btn blue is_add_button" data-parentid="'.$uniqueid.'" value="add" name="btnAction" style="float:right; margin-right: 10px;"><span>Add Image</span></button>';
                $select_button = '<button class="btn blue is_select_button" data-parentid="'.$uniqueid.'" value="select" name="btnAction"><span>Select Image</span></button>';
                $cancel_button = '<button class="btn gray cancel" id="is_cancel_button" value="cancel" name="btnAction" style="float:right;"><span>Close</span></button>';

                $selected_area = '<div id="is_selected_images"><ul id="is_sortable"></ul><br style="clear: both;" /></div>';
                $input_field = '<div class="is_input_field"><input type="text" id="'.$data['form_slug'].'" name="'.$data['form_slug'].'" value="'.htmlentities($values).'" readOnly /></div>';
                $is_single = '<input type="hidden" id="wcept_is_single" value="0" />';
                
                $popup_file_view = '<div style="display: none;"><div id="is_colorbox" class="'.$uniqueid.'-cb" style="height: 100%;">
                        <div style="height: 40px; width: 96%; top: 0; background: #fff; position: absolute; z-index: 100000;">'.form_dropdown('folder_select', $folder_select, '', 'id="folder_select"').'</div>
                        <div class="image_grid" style="height: 100%; padding-top: 40px; overflow: auto; background: #fff; box-sizing:border-box; -moz-box-sizing:border-box;"></div>
                        <div style="height: 38px; width: 96%; bottom: 0; background: #fff; position: absolute;">'.$cancel_button.$add_button.'</div>
                    </div></div>';
            }
            
            return $container_open.$is_single.$select_button.$input_field.$selected_area.$popup_file_view.$container_close;
        }
        
	public function event($field)
	{
		$this->CI->type->add_js('image_select', 'image_select.js');
		$this->CI->type->add_css('image_select', 'image_select.css');
	}
        
        public function param_single($value = 0)
	{
		return '<label><input type="radio" name="single" id="single" value="1" '.($value == 1? 'checked': '').' /> Single Select</label> <label><input type="radio" name="single" id="single" value="0" '.($value != 1? 'checked': '').' /> Multiple Select</label>';
	}
}
