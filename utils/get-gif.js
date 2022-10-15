const apiUrl = "https://api.giphy.com/v1/gifs/";
// !Need to hide this
const apiKey = "80bfcbf357864cd18518c324f47a7098";

export async function getGif(searchQuery, offset = 0) {
  const url = searchQuery.toLowerCase() === 'trending'
    ? `${apiUrl}trending?api_key=${apiKey}&offset=${offset}&limit=1`
    : `${apiUrl}search?api_key=${apiKey}&q=${searchQuery.replace('#', '')}&offset=${offset}&limit=1`
  const res = await fetch(url);
  const data = await res.json();
  const gifs = await data.data.map((d) => ({
    url: d.images.fixed_height_downsampled.url,
    title: d.title,
    user: d?.user,
  }));
  return gifs;
}
