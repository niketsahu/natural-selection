/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';

const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;