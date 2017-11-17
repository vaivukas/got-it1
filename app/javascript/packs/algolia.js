const client = algoliasearch("3QRXVE4VDT", "0448f9b83bca12989799aaf181b86677");
const index = client.initIndex('Product');
const container = document.getElementById('card-row');
const form = document.getElementById('search');



// get params from URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// define search method
const algoliaSearch = () => {
  const map_markers = [];
  container.innerHTML = "";
  query = form.value;
  // query the algolia api for search results
  index.search(query, {aroundLatLngViaIP: true }).then(
    function searchDone(content) {

      // updates the counter at the top of the page
      counter = document.getElementById('counter');
      counter.innerHTML = `<h1>${content.hits.length} Search results in your area...</h1>`;




      content.hits.forEach(product => {
        if (product._geoloc.lat != null || !product._geoloc.lon != null){
          map_markers.push({lat: product._geoloc.lat, lng: product._geoloc.lng})
        }
        // Appends a new card to the cards container for every search result.
        container.insertAdjacentHTML('beforeend', `
          <div class="col-xs-12 col-sm-6">
            <div class="card">
              <a class='link-to-product' href='https://got-it-wagon.herokuapp.com/products/${product.objectID}/'>
                <div class='card-body' style='background-image: url(https://proxy.spigotmc.org/4b123d1a0ba53e5a0ee9982d40de07819a793530?url=http%3A%2F%2Fdazedimg.dazedgroup.netdna-cdn.com%2F786%2Fazure%2Fdazed-prod%2F1150%2F0%2F1150228.jpg)'></div>
                <div class="card-footer">
                  <div class="container">
                    <div class="row">
                      <div class="col-xs-12 col-lg-6">
                        <span class="description">${product["name"]}</span>
                      </div>
                      <div class="col-xs-12 col-lg-6">
                        <span class="price">£${product["price_per_day"]}/day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>`);
      });
    });
  var handler = Gmaps.build('Google');
  handler.buildMap({ internal: { id: 'map' } }, function() {
    markers = handler.addMarkers(map_markers);
    handler.bounds.extendWith(markers);
    handler.fitMapToBounds();
    handler.getMap().setZoom(3);
  });
};



// When the page loads, search for the search param using algolia search
$(document).ready(()=> {
  const params = getParameterByName('search')
  form.value = params;
  algoliaSearch();
});

// When a key is pressed in the form, search and update
form.addEventListener('keyup', (event) => {
  algoliaSearch();
})

