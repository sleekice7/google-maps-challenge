

//call the function displayStores on the load of the web page.
window.onload = function() {
   
}

var map;
var markers = [];
var infoWindow;

//function for calling google map
function initMap() {
    var starbucks = {lat: 34.060855, lng: -118.205712};
    map = new google.maps.Map(document.getElementById('map'), {
        center: starbucks,
        zoom: 11,
        mapTypeId: 'roadmap',
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

function searchStores() {
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode){
        for(var store of stores){
            var postal = store['address']['postalCode'].substring(0, 5);
            if (postal == zipCode){
                foundStores.push(store);
            }
        }
    } else{
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations() {
    infoWindow.close();
    for(var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener() {
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}

//following is for looping through stores
function displayStores(stores) {
    var storesHtml = '';
    for(var [index, store] of stores.entries()){
        var address = store['addressLines'];
        var phone = store['phoneNumber'];
        storesHtml += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                        <div class="store-phone-number">
                            <span>${phone}</span>
                        </div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index + 1}
                        </div>
                    </div>
                </div>
            </div>
        `
        document.querySelector('.stores-list').innerHTML = storesHtml;
    }
}

function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    for(var [index, store] of stores.entries()){
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);
        var name = store["name"];
        var address = store["addressLines"][0];
        var openStatusText = store["openStatusText"];
        var phoneNumber = store["phoneNumber"];
        bounds.extend(latlng);
        createMarker(latlng, name, address,openStatusText, phoneNumber, index+1);
    }
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address,openStatusText,phoneNumber, index) {
    var html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
                ${address}
            </div>
            <div class="store-info-status">
                <div class="circle">
                    <i class="fas fa-coffee"></i>
                </div>
                ${openStatusText}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone"></i>
                </div>
                ${phoneNumber}
            </div>
        </div>
    `
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: index.toString()
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}