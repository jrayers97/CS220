let robot = lib220.loadImageFromURL(
'https://people.cs.umass.edu/~joydeepb/robot.jpg');

function removeBlueAndGreen(input){
  let img = input.copy();
  for(let y = 0; y < img.height; ++y){
    for(let x = 0; x < img.width; ++x){
      let pix = img.getPixel(x,y);
      //set the pixel's green/blue parts to 0
      img.setPixel(x,y,[pix[0],0.0,0.0]);
    }
  }
  return img;
}
//robot.show();
//removeBlueAndGreen(robot);

function pixelMean(x,y,z){
  return (x+y+z)/3;
}

function makeGrayscale(input){
  let img = input.copy();
  for(let y = 0; y < img.height; ++y){
    for(let x = 0; x < img.width; ++x){
      let pix = img.getPixel(x,y);
      if(pix.length === 3){
        //use pixelMean to take the average of the pixel colors
        let mean = pixelMean(pix[0], pix[1], pix[2]);
        img.setPixel(x,y,[mean, mean, mean]);
      }
    }
  }
  return img;
  //return img.show();
}
//makeGrayscale(robot).show();

function highlightEdges(input){
  let img = input.copy();
  for(let y = 0; y < img.height; ++y){
    for(let x = 0; x < img.width; ++x){
      let pix1 = img.getPixel(x,y);
      //if x+1 is a pixel in the image
      if(x+1 < img.width){
        let pix2 = img.getPixel(x+1,y);
        let m1 = pixelMean(pix1[0], pix1[1], pix1[2]);
        let m2 = pixelMean(pix2[0], pix2[1], pix2[2]);
        let color = Math.abs(m1-m2);
        //set the pixel colors to be the absolute value of m1-m2
        img.setPixel(x,y,[color,color,color]);
      }
      //if x+1 is a pixel outside the image, use x itself
      else{
        img.setPixel(x,y,[0.0,0.0,0.0]);
      }
    }
  }
  return img;
}
//highlightEdges(robot).show();

function blur(input){
  let img = input.copy();
  for(let y = 0 ; y < img.height; ++y){
    for(let x = 0; x < img.width; ++x){
      let pix = img.getPixel(x,y);
      let sumRed = 0;
      let sumGreen = 0;
      let sumBlue = 0;
      //the count will only increase if the pixel is in range
      let count = 0;
      let mean = [0.0,0.0,0.0];
      //this for loop checks the 5 pixels to the right and the pixel itself
      for(let i = 0; i < 6; ++i){
        //if the x+i pixel is within the image, add it's red, green and blue parts to the respective sum
        if(x+i < img.width){
          let nextPix = img.getPixel(x+i,y);
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
        if(x-i > 0){
          let nextPix = img.getPixel(x-i,y);
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
      img.setPixel(x,y,[mean[0],mean[1],mean[2]]);
    }
  }
  return img;
}
blur(robot).show();

test('removeBlueAndGreen function definition is correct', function() {
  const white = lib220.createImage(10, 10, [1,1,1]);
  removeBlueAndGreen(white).getPixel(0,0);
  // Need to use assert
});

test('No blue or green in removeBlueAndGreen result', function() {
// Create a test image, of size 10 pixels x 10 pixels, and set it to all white.
const white = lib220.createImage(10, 10, [1,1,1]);
// Get the result of the function.
const shouldBeRed = removeBlueAndGreen(white);
// Read the center pixel.
const pixelValue = shouldBeRed.getPixel(5, 5);
// The red channel should be unchanged.
assert(pixelValue[0] === 1);
// The green channel should be 0.
assert(pixelValue[1] === 0);
// The blue channel should be 0.
assert(pixelValue[2] === 0);
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
test('Check pixel equality', function() {
const inputPixel = [0.5, 0.5, 0.5]
// Create a test image, of size 10 pixels x 10 pixels, and set it to the inputPixel
const image = lib220.createImage(10, 10, inputPixel);
// Process the image.
const outputImage = removeBlueAndGreen(image);
// Check the center pixel.
const centerPixel = outputImage.getPixel(5, 5);
assert(pixelEq(centerPixel, [0.5, 0, 0]));
// Check the top-left corner pixel.
const cornerPixel = outputImage.getPixel(0, 0);
assert(pixelEq(cornerPixel, [0.5, 0, 0]));
});

test('Check pixel equality', function() {
const inputPixel = [0.5, 0.5, 0.5]
// Create a test image, of size 10 pixels x 10 pixels, and set it to the inputPixel
const image = lib220.createImage(10, 10, inputPixel);
// Process the image.
const outputImage = makeGrayscale(image);
// Check the center pixel.
const centerPixel = outputImage.getPixel(5, 5);
assert(pixelEq(centerPixel, [0.5, 0.5, 0.5]));
// Check the top-left corner pixel.
const cornerPixel = outputImage.getPixel(0, 0);
assert(pixelEq(cornerPixel, [0.5, 0.5, 0.5]));
});

test('Check pixel equality', function() {
const inputPixel = [0.5, 0.5, 0.5]
// Create a test image, of size 10 pixels x 10 pixels, and set it to the inputPixel
const image = lib220.createImage(10, 10, inputPixel);
// Process the image.
const outputImage = highlightEdges(image);
// Check the center pixel.
const centerPixel = outputImage.getPixel(5, 5);
assert(pixelEq(centerPixel, [0, 0, 0]));
// Check the top-left corner pixel.
const cornerPixel = outputImage.getPixel(0, 0);
assert(pixelEq(cornerPixel, [0, 0, 0]));
});

test('Check pixel equality of blur', function() {
const inputPixel = [0.5, 0.5, 0.5]
// Create a test image, of size 10 pixels x 10 pixels, and set it to the inputPixel
const image = lib220.createImage(10, 10, inputPixel);
// Process the image.
const outputImage = blur(image);
// Check the center pixel.
const centerPixel = outputImage.getPixel(5, 5);
assert(pixelEq(centerPixel, [0.5, 0.5, 0.5]));
// Check the top-left corner pixel.
const cornerPixel = outputImage.getPixel(0, 0);
assert(pixelEq(cornerPixel, [0.5, 0.5, 0.5]));
});
