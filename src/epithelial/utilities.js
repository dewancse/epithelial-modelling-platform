/**
 * Created by dsar941 on 5/8/2017.
 */
// TODO: temp solution, fix this in svg
function getTextWidth(text, fontSize, fontFace) {
    var a = document.createElement('canvas');
    var b = a.getContext('2d');
    b.font = fontSize + 'px ' + fontFace;
    return b.measureText(text).width;
}

// Utility to calculate number of iterations
function iteration(length) {
    var sum = 0;
    for (var i = 0; i < length; i++) {
        sum = sum + (length - i - 1);
    }

    return sum;
}

exports.getTextWidth = getTextWidth;
exports.iteration = iteration;