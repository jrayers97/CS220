let robot = lib220.loadImageFromURL(
'https://people.cs.umass.edu/~joydeepb/robot.jpg');

function imageMap(img, func){
  let image = img.copy();
  for(let y = 0; y < img.height; ++y){
    for(let x = 0; x < img.width; ++x){
      let pix = image.getPixel(x,y);
      image.setPixel(x,y,func(image,x,y));
    }
  }
  return image;
}
//questions: how to get boolean, & blur pixel thingy
//doesnt like if-else statments
/*
imageMap(robot, function(img, x, y) {
  const c = img.getPixel(x, y);
  return [c[0], 0, 0];
}).show();
*/

//similar to reduce
function imageMask(img, func, maskValue){
  let image = img.copy();
  let newFunc = function(image,x,y){
    let pix = image.getPixel(x,y);
    if(func(image,x,y) === true){
      return maskValue;
    }
    else{
      return pix;
    }
  };
  return imageMap(image, newFunc);
}

/*
imageMask(robot, function(img, x, y) {   
  return (y % 10 === 0);}, [1, 0, 0]).show(); 
*/
function blurPixel(image, x, y){
  //let image = img.copy();
  let pix = image.getPixel(x,y);
  let sumRed = 0;
  let sumGreen = 0;
  let sumBlue = 0;
      //the count will only increase if the pixel is in range
  let count = 0;
  let mean = [0.0,0.0,0.0];
      //this for loop checks the 5 pixels to the right and the pixel itself
  for(let i = 0; i < 6; ++i){
        //if the x+i pixel is within the image, add it's red, green and blue parts to the respective sum
  if((x+i) < (image.width)){
  let nextPix = image.getPixel(x+i,y);
      sumRed += nextPix[0];
      sumGreen += nextPix[1];
      sumBlue += nextPix[2];
      count = count +1;
    }
        //otherwise just add 0
  else{
      sumRed += 0;
      sumGreen += 0;
      sumBlue += 0;
    }
  }
      //get the 5 pixels to the left
  for(let i = 5; i > 0; --i){
    if((x-i) > 0){
      let nextPix = image.getPixel(x-i,y);
      sumRed += nextPix[0];
      sumGreen += nextPix[1];
      sumBlue += nextPix[2];
      count = count +1;
    }
    //if the x-i pixel is outside the image just add 0
    else{
      sumRed += 0;
      sumGreen += 0;
      sumBlue += 0;
    }
  }
  //take the mean of the red, green and blue ones.
  mean[0] = sumRed/count;
  mean[1] = sumGreen/count;
  mean[2] = sumBlue/count;
  return [mean[0],mean[1],mean[2]];
}

function blurImage(img){
  let image = img.copy();
  return  imageMap(image, function(image, x, y) {   
    return (blurPixel(image,x,y));}); 
}

//blurImage(robot).show();

function isDark(img, x, y){
  let pix = img.getPixel(x,y);
  if(pix[0]< 0.5 && pix[1]< 0.5 && pix[2] < 0.5){
    return true;
  }
  else{
    return false;
  }
}

function darken(img){
  let image = img.copy();
  return imageMask(image, function(img, x, y) {   
    return (isDark(image,x,y)===true);}, [0, 0, 0])
}
darken(robot).show();

function isLight(img, x, y){
  let pix = img.getPixel(x,y);
  if(pix[0]>=0.5 && pix[1]>=0.5 && pix[2] >= 0.5){
    return true;
  }
  else{
    return false;
  }
}

function lighten(img){
  let image = img.copy();
  return imageMask(image, function(img, x, y) {  
    return (isLight(image,x,y) === true);}, [1, 1, 1])
}

lighten(robot).show();

function lightenAndDarken(img){
  let image = img.copy();
  return darken(lighten(image));
}
lightenAndDarken(robot).show();

test('imageMap function definition is correct', function() {
let identityFunction = function(image, x, y) {
return image.getPixel(x, y);
};
let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
let outputImage = imageMap(inputImage, identityFunction);
// Output should be an image, so getPixel must work without errors.
let p = outputImage.getPixel(0, 0);
assert(p[0] === 0);
assert(p[1] === 0);
assert(p[2] === 0);
assert(inputImage !== outputImage);
});

function pixelEq (p1, p2) {
const epsilon = 0.002;
for (let i = 0; i < 3; ++i) {
if (Math.abs(p1[i] - p2[i]) > epsilon) {
return false;
}
}
return true;
};
test('identity function with imageMap', function() {
let identityFunction = function(image, x, y ) {
return image.getPixel(x, y);
};
let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]);
inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
let outputImage = imageMap(inputImage, identityFunction);
assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5]));
assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3]));
assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8]));
assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
});