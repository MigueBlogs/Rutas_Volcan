<?php
    date_default_timezone_set('America/Mexico_City');

    $errors = Array();
    $uploaded = Array();

    $uploads_dir = '/var/www/html/uploads/';
    $file = $_FILES['file']['name'];
    $file_info = explode('.',$file);
    $file_ext = strtolower(end($file_info));
    $date = new DateTime();
    $newName = 'reporteImagen_'.$date->format('YmdHisu').".".$file_ext;
    $target_path = $uploads_dir.$newName;

    $file_size = $_FILES["file"]["size"];
    $extensions = array("jpg","png","gif","jpeg");

    if(in_array($file_ext, $extensions) === false){
        $errors[] = "No esta permitido el tipo de archivo.";
    }
    
    if($file_size > 5242880) {
        $errors[] = 'Tamaño máximo de archivo 5 MB';
    }

    if(empty($errors) == true) {

        if (move_uploaded_file( $_FILES['file']['tmp_name'], $target_path)) {
            $uploaded = array(
                'name' => $newName,
                'url' => 'http://www.preparados.gob.mx/uploads/'.$newName
            );
        } else {
            $errors[] = 'No fue posible subir el archivo';
        }
    }
    
    $response = array(
        'uploaded' => $uploaded,
        'errors' => $errors
    );

    echo json_encode($response);
?>