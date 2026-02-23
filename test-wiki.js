const q = "Mahindra Thar";
fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&utf8=&format=json&origin=*`)
  .then(r => r.json())
  .then(data => {
    const title = data.query.search[0]?.title;
    if (title) {
        return fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=400&origin=*`)
          .then(r => r.json())
          .then(d => {
             const pages = d.query.pages;
             const page = Object.values(pages)[0];
             console.log("Image URL:", page.thumbnail?.source);
          });
    } else {
       console.log("Not found");
    }
  });
