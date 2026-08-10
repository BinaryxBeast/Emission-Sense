import google from 'googlethis';

async function test() {
    try {
        const images = await google.image('Honda City official car photo', { safe: false });
        console.log("Images found:", images.length);
        if (images.length > 0) {
            console.log("First image:", images[0]);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
