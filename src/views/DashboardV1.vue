<template>
    <div class="home">
        <div class="container">
            <div class="grid">
                <a href="#" class="btn1"><img src="@/assets/tile_icon/access.svg" alt="mail"></a>
                <a href="#" class="btn2"><img src="@/assets/tile_icon/weather.svg" alt="gallery"></a>
                <a href="#" class="btn3"><img src="@/assets/tile_icon/camera.svg" alt="calender"></a>
                <a href="#" class="btn4"><img src="@/assets/tile_icon/chrome.svg" alt="list"></a>
                <a href="#" class="btn5"><img src="@/assets/tile_icon/cortana.svg" alt="contacts"></a>
                <a href="#" class="btn6"><img src="@/assets/tile_icon/weather.svg" alt="play"></a>
                <a href="#" class="btn7"><img src="@/assets/tile_icon/weather.svg" alt="gallery"></a>
                <a href="#" class="btn8"><img src="@/assets/tile_icon/weather.svg" alt="videoplay"></a>
                <a href="#" class="btn9"><img src="@/assets/tile_icon/weather.svg" alt="users"></a>
                <a href="#" class="btn10"><img src="@/assets/tile_icon/weather.svg" alt="settings"></a>
                <a href="#" class="btn11"><img src="@/assets/tile_icon/weather.svg" alt="twitter"></a>
                <a href="#" class="btn12"><img src="@/assets/tile_icon/weather.svg" alt="viemo"></a>
                <a href="#" class="btn13"><img src="@/assets/tile_icon/weather.svg" alt="youtube"></a>
                <a href="#" class="btn14"><img src="@/assets/tile_icon/weather.svg" alt="facebook"></a>
                <a href="#" class="btn15"><img src="@/assets/tile_icon/weather.svg" alt="instagram"></a>
                <a href="#" class="btn16"><img src="@/assets/tile_icon/weather.svg" alt="linkedin"></a>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
</script>
<style scope>
.home {
    background-color: rgb(74, 126, 87);
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
}

.container {
    width: 41vw;
    margin: auto;
    background-color: rgba(255, 255, 255, 0);
}

.container a {
    text-decoration: none;
    display: block;
    transition: transform .3s, box-shadow .4s;
}

.container a:hover {
    position: relative;
    z-index: 1;
    -webkit-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
    transform: scale(1.03);
}

img {
    width: 40%;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.grid {
    margin: 0;
    padding: 0;
    display: grid;
    grid-gap: 5px;
    grid: repeat(5, 7rem) / repeat(5, 7rem);
    grid-template-areas: "btn1 btn2 btn2 btn3 btn4" "btn5 btn2 btn2 btn6 btn4" "btn7 btn7 btn8 btn6 btn9" "btn10 btn11 btn8 btn12 btn13" "btn10 btn14 btn15 btn16 btn16";
}

.btn1 {
    background-color: orange;
    grid-area: btn1;
}

.btn2 {
    background-color: rgb(67, 67, 179);
    grid-area: btn2;
}

.btn3 {
    background-color: navajowhite;
    grid-area: btn3;
}

.btn4 {
    background-color: rgb(173, 65, 65);
    grid-area: btn4;
}

.btn5 {
    background-color: yellow;
    grid-area: btn5;
}

.btn6 {
    background-color: brown;
    grid-area: btn6;
}

.btn7 {
    background-color: rgb(124, 165, 13);
    grid-area: btn7;
}

.btn8 {
    background-color: olive;
    grid-area: btn8;
}

.btn9 {
    background-color: lightsalmon;
    grid-area: btn9;
}

.btn10 {
    background-color: khaki;
    grid-area: btn10;
}

.btn11 {
    background-color: indianred;
    grid-area: btn11;
}

.btn12 {
    background-color: gold;
    grid-area: btn12;
}

.btn13 {
    background-color: darkslateblue;
    grid-area: btn13;
}

.btn14 {
    background-color: rgb(187, 48, 230);
    grid-area: btn14;
}

.btn15 {
    background-color: royalblue;
    grid-area: btn15;
}

.btn16 {
    background-color: maroon;
    grid-area: btn16;
}
</style>