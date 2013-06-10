<?php
	if ( ! defined('BASEPATH')) exit('No direct script access allowed');
	
	/****************************************** RESIZE IMAGE *****************************************************/
	
    # resize,scale, or crop images with or not maintain aspect ratio
    # usage:
    # resizeimage(uploaded file, thumb height, thumb width, jpg quality, scale thumb (true) or fixed size (false); 
		/* NOTE height and width should not be NULL */
	//scale  [scale  --> scale image and maintain aspect ratio {{default}}]
	//scale  [crop   --> scale and crop and maintain aspect ration]
	//scale  [noscale--> resize with no scale nore crop (doesn't maintain aspect ratio)]
	
	//output [string --> return resource link (image as binary string){{default}}]	
	/* NOTE that you have to call imagedestroy($destImage) after calling resizeimage() */
	//output [print  --> display the new on screen]
	//output [$filename --> save the new image as $filename]
    function resizeimage($original, $max_width, $max_height, $quality, $scale = "scale", $output = "string")
	{
		//list ($src_width, $src_height, $type, $w) = getimagesize($original);
		$imageinfo  = getimagesize($original);
		$src_width  = $imageinfo[0];
		$src_height = $imageinfo[1];
		$imagetype  = $imageinfo['mime'];
		//get the portion after '/' from the file type -->> image/jpeg OR image/gif OR application/....
		$imagetype  =explode("/",$imagetype);
		$type       =$imagetype[1];
		//echo $type;
        
		//if image is jpg image
		if($type == "jpeg" || $type == "pjpg" || $type == "jpg"){
			if (!$srcImage = @imagecreatefromjpeg($original))
				return false;
		}
		//if image is png image
		else if($type == "png" || $type == "x-png"){
			if (!$srcImage = @imagecreatefrompng($original))
				return false;
		}
		//if image is gif image
		else if($type == "gif"){
			if (!$srcImage = @imagecreatefromgif($original))
				return false;
		}

        # image resizes to natural height and width
        if ($scale == "scale") {
		
			//calculate the width factor(ratio)
			$Wfactor=$max_width/$src_width;
			//calculate the height factor(ratio)
			$Hfactor=$max_height/$src_height;
			//if width factor < height factor then scale according to the width else vis versa
			if($Wfactor < $Hfactor){
				//new width equal box width(destination)
				$thumb_width = $max_width;
				$thumb_height = ceil($src_height * $Wfactor);
			}
			else if($Hfactor < $Wfactor){
				$thumb_height = $max_height;
				$thumb_width = ceil($src_width * $Hfactor);
			}
			else{
                $thumb_width = $max_width;
                $thumb_height = $max_height;
            }
			
            if (!@$destImage = imagecreatetruecolor($thumb_width, $thumb_height)) {
                return false;
            }
			//if the image is png image then preserve it's transparency
			if($type == "png" || $type == "x-png"){
				// Turn off transparency blending (temporarily)
                imagealphablending($destImage, false);
   
                // Create a new transparent color for image
                $color = imagecolorallocatealpha($destImage, 0, 0, 0, 127);
   
                // Completely fill the background of the new image with allocated color.
                imagefill($destImage, 0, 0, $color);
   
                // Restore transparency blending
                imagesavealpha($destImage, true);
            }
            
            if (!@imagecopyresampled($destImage, $srcImage, 0, 0, 0, 0, $thumb_width, $thumb_height, $src_width, $src_height)) {
                return false;
            }
                        
        # image is fixed to supplied width and height and cropped
        } else if ($scale == "crop") {
			$off_w = 0;
			$off_h = 0;
			//calculate the width factor(ratio)
			$Wfactor=$max_width/$src_width;
			//calculate the height factor(ratio)
			$Hfactor=$max_height/$src_height;
			//resize according to the larger factor
			if($Wfactor < $Hfactor){
				//new height equal box height(destination)
				$thumb_height = $max_height;
				$thumb_width = ceil($src_width * $Hfactor);
				//clip from the center
				$off_w = (($thumb_width-$max_width)/2)/$Hfactor;
			}
			else if($Hfactor < $Wfactor){
				$thumb_width = $max_width;
				$thumb_height = ceil($src_height * $Wfactor);
				//clip from the center
				$off_h = (($thumb_height-$max_height)/2)/$Wfactor;
			}
			else{
                $thumb_width = $max_width;
                $thumb_height = $max_height;
            }
			
			if (!@$destImage = imagecreatetruecolor($max_width, $max_height)) {
			return false;
			}
			if($type == "png" || $type == "x-png"){
			// Turn off transparency blending (temporarily)
			imagealphablending($destImage, false);
			
			// Create a new transparent color for image
			$color = imagecolorallocatealpha($destImage, 0, 0, 0, 127);
			
			// Completely fill the background of the new image with allocated color.
			imagefill($destImage, 0, 0, $color);
			
			// Restore transparency blending
			imagesavealpha($destImage, true);
			}
			
			if (!@imagecopyresampled($destImage, $srcImage, 0, 0, $off_w, $off_h, $thumb_width, $thumb_height, $src_width, $src_height)) {
			return false;
			}
        }
		//resize image with no scale nore crop (doesn't maintain aspect ratio)
		else if ($scale == "noscale") {
			if (!@$destImage = imagecreatetruecolor($max_width, $max_height)) {
                return false;
            }
			if($type == "png" || $type == "x-png"){
				// Turn off transparency blending (temporarily)
                imagealphablending($destImage, false);
   
                // Create a new transparent color for image
                $color = imagecolorallocatealpha($destImage, 0, 0, 0, 127);
   
                // Completely fill the background of the new image with allocated color.
                imagefill($destImage, 0, 0, $color);
   
                // Restore transparency blending
                imagesavealpha($destImage, true);
            }
            
            if (!@imagecopyresampled($destImage, $srcImage, 0, 0, 0, 0, $max_width, $max_height, $src_width, $src_height)) {
                return false;
            }
		}//end if noscale
        
        @imagedestroy($srcImage);

		//used to antialias polygonal shapes created by php
        /*if (!@imageantialias($destImage, true)) {
            return false;
        }*/
        
		//return image string or display or save the new resized image
		switch($output){
			//if return as binary string
			case "string":
				//to capture the image output we disable the output to the page then capture
				ob_start();
				//if image is jpg image
				if($type == "jpeg" || $type == "pjpg" || $type == "jpg"){
					if (!@imagejpeg($destImage, NULL, $quality)) {
						ob_end_clean();
						return false;
					}
				}
				//if image is png image
				else if($type == "png" || $type == "x-png"){
					if (!@imagepng($destImage, NULL, 1)) {
						ob_end_clean();
						return false;
					}
				}
				//if image is gif image
				else if($type == "gif"){
					if (!@imagegif($destImage, NULL, $quality)) {
						ob_end_clean();
						return false;
					}
				}
				$newImage=ob_get_contents();
				ob_end_clean();
				@imagedestroy($destImage);				
				return $newImage;
				break;
				
			//if print on the screen (page)
			case "print":
				//if image is jpg image
				if($type == "jpeg" || $type == "pjpg" || $type == "jpg"){
					if (!@imagejpeg($destImage, NULL, $quality))
						return false;
				}
				//if image is png image
				else if($type == "png" || $type == "x-png"){
					if (!@imagepng($destImage, NULL, 1))
						return false;
				}
				//if image is gif image
				else if($type == "gif"){
					if (!@imagegif($destImage, NULL, $quality))
						return false;
				}
				break;
				
			//if any thing else -then it's a file name+path then save the new image	
			default:
				//if image is jpg image
				if($type == "jpeg" || $type == "pjpg" || $type == "jpg"){
					if (!@imagejpeg($destImage, $output, $quality))
						return false;
				}
				//if image is png image
				else if($type == "png" || $type == "x-png"){
					if (!@imagepng($destImage, $output, 1))
						return false;
				}
				//if image is gif image
				else if($type == "gif"){
					if (!@imagegif($destImage, $output, $quality))
						return false;
				}
				break;
		}//end switch
		
		@imagedestroy($destImage);
		return true;
    }//end resizeimage()
?>