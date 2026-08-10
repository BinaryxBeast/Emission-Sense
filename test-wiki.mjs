async function getWikipediaImage(title) {
    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=500`;
        const response = await fetch(url);
        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (pageId !== '-1' && pages[pageId].thumbnail) {
            console.log("Found image:", pages[pageId].thumbnail.source);
            return pages[pageId].thumbnail.source;
        } else {
            console.log("No image found on Wikipedia.");
            return null;
        }
    } catch (e) {
        console.error("Wikipedia API Error:", e);
        return null;
    }
}

getWikipediaImage("Honda Unicorn");
