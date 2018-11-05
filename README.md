# xdafirmware
Sony firmware download


This open source code to download Sony Mobile Xperia firmware from official Sony webservices.

This is a NodeJs application


A single page application with no server part would be great, but CORS is hard to avoid, so just added a server part for calling webservices

The application under construction is hosted thanks to Heroku here:

https://xdafirmware.herokuapp.com/


##DONE:
- search phone model and get back device information
- retrieve phone model icon
- retrieve all available firmwares


##TODO:
- display the files to download
- display the download links: files are divied by chunk map
- provide merge instruction, or try to merge file into a dynamic blob


Thanks for helping to dev it
