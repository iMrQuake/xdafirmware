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
  // attach the function to the search button
  let phoneModelBtn = document.querySelector('#phoneModelBtnId');
  phoneModelBtn.addEventListener('click', searchPhoneModel);

  // initialize the Datatables, and allow single selection on the firmware table
  $('#deviceServiceInfosId').DataTable({
    select: 'single'
  });

  // attach the function when a row is selected in the firmware table meaning, a selected firmware / customization
  $('#deviceServiceInfosId').DataTable().on( 'select', dataTablesOnSelect);

});


/**
 * Search the device firmware information, by providing its reference
 * TODO manage errors
 * TODO set a fix size for all icons, and book this area before the search, or put a picture with device question mark
 */
async function searchPhoneModel() {
  // get the model reference entered by the end-user; thaks user ! ;)
  let phoneModelValue = $('#phoneModelId').val();
  
  // building the api url
  let url = location.origin + '/xda/search/' + phoneModelValue;

  try {
    // ask axios to get the data from the api
    let axiosResponse = await axios.get(url);
    
    // getting the icon of the device
    let modelInformation = await axios.get(location.origin + '/xda/icon/' + phoneModelValue);

    // get the DOM image element
    let imgId = document.querySelector('#imgId');

    // set the url of the picture
    imgId.src = modelInformation.data[6];

    // fill the firmware table with the list of customozed firmaware
    fillCustomizationSelect(axiosResponse.data);

  } catch (error) {
    console.log(error);
  }
}


/**
 * Fill the firmware table with data
 *
 * @param {*} jsonData the firmwares data
 */
function fillCustomizationSelect(jsonData) {
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

        //console.log('Added option: ' + customerCustomization + ' with data: ' + JSON.stringify(softwareDeviceServiceInfoJsonObject));
      });
    }
  }
  let deviceTable = $('#deviceServiceInfosId');
  $('#deviceServiceInfosId').dataTable().fnClearTable();
  $('#deviceServiceInfosId').dataTable().fnAddData(tableData);
}

/**
 * TODO
 *
 * @param {*} e
 */
function displayDownloadLinks(e) {


};


/**
 * Call when a firmware is selected into the firmware table
 *
 * @param {*} e
 * @param {*} dt : Datatables interface API
 * @param {*} type : Datatable selected item type: expected: row
 * @param {*} indexes : Array of selected row indexes : only one because table selection is set to single
 */
function dataTablesOnSelect( e, dt, type, indexes ) {
  if ( type === 'row' ) {
    // only one single line select allow fromconfiguration  
    var dataArray = dt.rows(indexes[0]).data() ;
    for (let d = 0; d < dataArray.length; d++) {
      const rowData = dataArray[d];
    }  
  
    // TODO call api to get the files links to be downloaded and their respective names.
    // then diplay them for download
  }
};






