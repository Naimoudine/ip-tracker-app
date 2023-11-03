<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import leaflet from 'leaflet';

const userIp = ref();
let map = null; 
let marker = null;

const regexExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

const ipDetails = ref([]);
const ipLat = ref();
const ipLng = ref();

const errMsg = reactive({
    msg: "Please enter a valid IP Adress",
    invalid: null
})

// Call api for ip location
const fetcher = async (ip) => {
    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.VUE_APP_API_KEY}&ipAddress=${ip.value}`);
    const result = await response.json();
    ipDetails.value = [result];
    ipLat.value = ipDetails.value[0].location.lat;
    ipLng.value = ipDetails.value[0].location.lng;
}

const searchIp = () => {
    if(regexExp.test(userIp.value)) {
        fetcher(userIp);
        errMsg.invalid = null;
    } else {
        errMsg.invalid = true;
    }
}

watch(ipDetails, () => {
    map.flyTo([ipLat.value, ipLng.value]);
    marker.setLatLng([ipLat.value, ipLng.value]);
})

onMounted(async () => {
    map = leaflet.map('map', { zoomControl: false }).setView([32.69922, -117.11281], 13);
    leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);  
    marker = leaflet.marker([32.69922, -117.11281]).addTo(map);
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
})

</script>
<template>
    <div class="container">
        <header>
            <h1>IP Address Tracker</h1>
            <div class="location-searchbar">
                <input v-model="userIp" type="text" placeholder="Search for any IP address">
                <button @click="searchIp"><img src="../assets/images/icon-arrow.svg" alt=""></button>
            </div>
            <p v-show="errMsg.invalid" class="location-errMsg">{{ errMsg.msg }}</p>
        </header>
        <main>
            <div class="location-details-container">
                <div class="location-details-content">
                    <div class="location-ip">
                        <h3>Ip Adress</h3>
                        <p v-for="ip in ipDetails">{{ ip.ip }}</p>
                    </div>
                    <div class="location-adress">
                        <h3>Location</h3>
                        <p v-for="ip in ipDetails">{{ ip.location.city }}, {{ ip.location.region }}</p>
                    </div>
                    <div class="location-timezone">
                        <h3>Timezone</h3>
                        <p v-for="ip in ipDetails">UTC{{ ip.location.timezone }}</p>
                    </div>
                    <div class="location-isp">
                        <h3>ISP</h3>
                        <p v-for="ip in ipDetails">{{ ip.isp }}</p>
                    </div>
                </div>
            </div>
            <div class="location-map">
                <div id="map"></div>
            </div>
        </main>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');
    .container {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'Rubik', sans-serif;

        & header {
            width: 100%;
            padding: 4rem 1rem 10.5rem 1rem;
            background: url('../assets/images/pattern-bg-desktop.png') center/cover;

            @media (max-width: 630px) {
                background: url('../assets/images/pattern-bg-mobile.png') center/cover;
            }

            display: flex;
            flex-direction: column;
            align-items: center;

            & h1 {
                color: #FFF;
                font-weight: 600;
                margin-bottom: 1.5rem;
                font-size: 2.5rem;
            }

            @media (max-width: 1200px) {
                & h1 {
                    color: #FFF;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    font-size: 2rem;
                }
            }

            @media (max-width: 630px) {
                & h1 {
                    color: #FFF;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    font-size: 1.8rem;
                }
            }
            
            & .location-searchbar {
                display: flex;

                @media (max-width: 630px) {
                    width: 100%;
                }
                
                & input {
                    padding: 1.2rem 2rem;
                    font-size: 1,125rem;
                    border: none;
                    border-radius: 12px 0 0 12px;
                    width: 600px;

                    @media (max-width: 1200px) {
                        width: 500px;
                    }

                    @media (max-width: 630px) {
                        width: 100%;
                    }
                }

                & button {
                    border: none;
                    border-radius: 0 12px 12px 0;
                    height: 100%;
                    padding: 0.5rem 1.5rem;
                    background-color: #000;
                    color: #FFF;
                }
            }

            & .location-errMsg {
                margin-top: 0.5rem;
                color: #ff0000;
            }
        }

        & main {
            position: relative;
            height: 100%;
            width: 100%;
           & .location-details-container {
                width: 1170px;
                padding: 2.5rem;

                @media (max-width: 1200px) {
                    width: calc(100% - 4rem);
                    padding: 2.5rem 0;
                }

                @media (max-width: 824px) {
                    width: calc(100% - 2rem);
                    min-width: 272px;
                    padding: 1rem;
                }

                border-radius: 12px;
                background-color: #fff;
                box-shadow: 0px 20px 30px -20px rgba(66, 68, 90, 1);
                position: absolute;
                top: -80px;

                @media (max-width: 824px) {
                    top: -120px;
                }

                left: 50%;
                transform: translate(-50%, 0);
                z-index: 100;

                & .location-details-content {
                    display: flex;

                    @media (max-width: 824px) {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        align-items: center;
                        text-align: center;
                    }

                    & h3 {
                        text-transform: uppercase;
                        font-size: 0.875rem;

                        @media (max-width: 1200px) {
                            font-size: 0.75rem;
                        }

                        font-weight: 700;
                        color: hsl(0, 0%, 59%);
                    }

                    & p {
                        font-size: 1.5em;

                        @media (max-width: 1200px) {
                            font-size: 1.125em;
                        }
                        
                        font-weight: 700;
                        color: hsl(0, 0%, 17%);
                    }

                    & div {
                        border-right: 1px solid hsl(0, 0%, 17%);
                        padding: 0 2.2rem 0 2rem;

                        @media (max-width: 824px) {
                            border-right: none;
                            padding: 0;
                        }

                        &:last-child {
                            margin-right: 0;
                            border: none;

                        }
                    }
                }
           }

           & .location-map {
            height: 100%;
            width: 100%;
            & #map {
                z-index: 1;
                height: 100%;
                width: 100%;
            }
           }
        }
    }
</style>