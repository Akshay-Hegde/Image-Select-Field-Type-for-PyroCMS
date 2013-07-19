Image Select Field Type for PyroCMS 2.2.1
=========


##1. Adding into Pyro Stream
```php
    array(
        'name'      => 'Multiple Images',
        'slug'      => 'multiple_images',
        'namespace' => 'stream_namespace',
        'type'      => 'image_select',
        'assign'    => 'stream_slug',
        'extra'     => array('single' => false), // (default false)
        'required'  => false
    )
```


##2. Get Single Select Image

You can get the selected single image ID with 
```php
    {{ field_type_name }}
```

To get the complete image url:
```html
    <img src="{{ url:site }}files/large/{{ field_type_name }}" /> 
```
for full size image.


```html
    <img src="{{ url:site }}files/thumb/{{ field_type_name }}/400" />
```
for thumb image with max 400px width.


##3. Get Multiple Select Images

To get multiple image including the top image, you need to loop through the object array.
```php
    {{ field_type_name:top }} // Will display the top image's image ID.

    {{ field_type_name:images }} // Loop through the array for the image IDs
        {{ imageid }}
    {{ /field_type_name:images }}
```


By [Web Concept](http://wcept.com)
