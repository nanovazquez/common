Before running the application, you need to:

1. Open Windows PowerShell for MongoDB Node.js and navigate to the folder where you placed the sample.
2. Type 'Add-AzureMongoWorkerRole ReplicaSetRole 3' and press ENTER.
3. Type 'Join-AzureNodeRoleToMongoRole sample-web ReplicaSetRole' and press ENTER
4. Navigate to the sample-web folder an run 'npm install'
5. Type 'Start-AzureEmulator' and press ENTER. 

Since this application is just for sample purposes, it's not ready to be deployed to Windows Azure as is. 

For that, place the following binaries inside the bin folder:

* iisnode.msi
* node.exe
* vcredist_x64.exe