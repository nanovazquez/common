Before running the application, you need to:

1. Open **Windows Azure PowerShell for Node.js** from the **Start** menu.
2. Navigate to the explorer-web folder an run `npm install`
3. Type `Start-AzureEmulator -launch` and press ENTER. 

Since this application is just for sample purposes, it's not ready to be deployed to Windows Azure as is. 
For that, you need to perform the following steps:

1. Add your Windows Azure Storage credentiales inside the web.cloud.config file.
2. Place the following binaries inside the bin folder:

	* iisnode.msi
	* node.exe
	* vcredist_x64.exe