'use strict';

// geolocationをそのまま使う
navigator.geolocation.getCurrentPosition(success, fail);

// 位置情報の取得に成功したらlatiとlongiを呼び出す。失敗したらエラーメッセージ
function success(pos) {
    ajaxRequest(pos.coords.latitude, pos.coords.longitude);
}
function fail(error) {
    alert('位置情報の取得に失敗しました。エラーコード：' + error.code);
}

// UNIX UTC時間を秒からミリ秒に変換する必要あり
function utcToJSTime(utcTime) {
    return utcTime * 1000;
}

// データ取得するためにリクエストするファンクション。リクエスト先をURLとIDで特定する必要.APPIDは削除してから提出のこと！
function ajaxRequest(lat, long) {
    const url = 'https://api.openweathermap.org/data/2.5/forecast';
    const appId = '';

    // jQueryの$ajaxを使ってAPIにデータのリクエストをする
    $.ajax({
        url: url,
        data: {
            appid: appId,
            lat: lat,
            lon: long,
            units: 'metric',
            lang: 'ja'
        }
    })
    .done(function(data) {
        // 都市名、国名
        $('#place').text(data.city.name + ', ' + data.city.country);

        // 天気予報データ。forEachのファンクションで
        data.list.forEach(function(forecast, index) {
            const dateTime = new Date(utcToJSTime(forecast.dt));
            const month = dateTime.getMonth() + 1;
            const date = dateTime.getDate();
            const hours = dateTime.getHours();
            const min = String(dateTime.getMinutes()).padStart(2, '0');
            const temperature = Math.round(forecast.main.temp);
            const description = forecast.weather[0].description;
            const iconPath = `images/${forecast.weather[0].icon}.svg`;

            // 現在の天気とそれ以外で出力を変える
            // 現在の天気IFで
            if(index === 0) {
                const currentWeather = `
                <div class="icon"><img src="${iconPath}"></div>
                <div class="info">
                    <p>
                        <span class="description">現在の天気：${description}</span>
                        <span class="temp">${temperature}</span>°C
                    </p>
                </div>`;
                $('#weather').html(currentWeather);
                // それ以外の場合をここで
            } else {
                const tableRow = `
                <tr>
                    <td class="info">
                        ${month}/${date} ${hours}:${min}
                    </td>
                    <td class="icon"><img src="${iconPath}"></td>
                    <td><span class="description">${description}</span></td>
                    <td><span class="temp">${temperature}°C</span></td>
                </tr>`;
                $('#forecast').append(tableRow);
            }
        });
    })
    .fail(function() {
        console.log('$.ajax failed!');
    })
}
