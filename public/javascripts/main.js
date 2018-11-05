// Copyright (C) 2018  imrquake

//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <https://www.gnu.org/licenses/>.



window.addEventListener('load', function () {
  let phoneModelBtn = document.querySelector('#phoneModelBtnId');
  phoneModelBtn.addEventListener('click', searchPhoneModel);

  $('#deviceServiceInfosId').DataTable({
    select: 'single'
  });


  $('#deviceServiceInfosId').DataTable().on( 'select', dataTablesOnSelect);

});

async function searchPhoneModel() {
  let phoneModelValue = $('#phoneModelId').val();
  //alert("Searching for model: " + phoneModelValue);;

  let url = location.origin + '/xda/search/' + phoneModelValue;
  //let url = '/xda' ;
  console.log('fetching url: ' + url);
  //let axiosResponse = await fetch(url) ;
  try {
    let axiosResponse = await axios.get(url);
    console.log('The XML file as json is:\n', axiosResponse.data);    

    let modelInformation = await axios.get(location.origin + '/xda/icon/' + phoneModelValue);
    console.log(modelInformation.data);

    let imgId = document.querySelector('#imgId');

    console.log('icon:', modelInformation.data[6]);
    imgId.src = modelInformation.data[6];

    

    fillCustomizationSelect(axiosResponse.data);

  } catch (error) {
    console.log(error);
  }




}


function fillCustomizationSelect(jsonData) {
  //= document.querySelector('#selectCustomizationId') ;
  let custoSelect = $('#selectCustomizationId');

  let tableData = [];

  if (jsonData.hasOwnProperty('device-service-infos')) {
    let deviceServiceInfosJsonObject = jsonData['device-service-infos'];
    if (deviceServiceInfosJsonObject.hasOwnProperty('software-device-service-info')) {
      let softwareDeviceServiceInfoJsonArray = deviceServiceInfosJsonObject['software-device-service-info'];

      softwareDeviceServiceInfoJsonArray.forEach(softwareDeviceServiceInfoJsonObject => {
        let customerCustomization = softwareDeviceServiceInfoJsonObject['customization'][0]['customer'];
        let cdf = softwareDeviceServiceInfoJsonObject['customization'][0]['cdf-id'];
        let optionElt = custoSelect.append($('<option>', {
          value: customerCustomization,
          text: customerCustomization,
          "data-json": JSON.stringify(softwareDeviceServiceInfoJsonObject)
        }));
        let softwareVersion = softwareDeviceServiceInfoJsonObject['software-version'][0];
        let productName = softwareDeviceServiceInfoJsonObject['product-name'][0];
        let releaseState = softwareDeviceServiceInfoJsonObject['release-state'][0];
        let link = softwareDeviceServiceInfoJsonObject['link'][0]['$'].href ;
        let linkTrack = softwareDeviceServiceInfoJsonObject['track-link'][0]['$']['href'] ;
        tableData.push([cdf, customerCustomization, softwareVersion, releaseState, link, linkTrack]);

        console.log('Added option: ' + customerCustomization + ' with data: ' + JSON.stringify(softwareDeviceServiceInfoJsonObject));
      });


    }


  }

  let deviceTable = $('#deviceServiceInfosId');
  $('#deviceServiceInfosId').dataTable().fnClearTable();
  $('#deviceServiceInfosId').dataTable().fnAddData(tableData);
}

function displayDownloadLinks(e) {


};


function dataTablesOnSelect( e, dt, type, indexes ) {
  if ( type === 'row' ) {
    // only one single line select allow fromconfiguration  
    var dataArray = dt.rows(indexes[0]).data() ;
    for (let d = 0; d < dataArray.length; d++) {
      const rowData = dataArray[d];
      //$('#linkId').text(link);
      //$('#trackLinkId').text(trackLink);
    }  
    
      // do something with the ID of the selected items
  }
};



