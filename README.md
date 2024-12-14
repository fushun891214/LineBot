啟用步驟
===

## 安裝相關套件
> ```mpm install```

## 設定環境變數
> ### 新增.env檔  
> ```LINE_BOT_ACCESS_TOKEN=你的LineBot Token```  
> ```LINE_BOT_SECRET=你的LineBot SECRET```  
> ```OPENAI_API_KEY=你的GPT API Key```  
> ```SERVER_PORT=你的API Server的Port號(我習慣用設3000)```  

## 執行專案
> ```npm run build```  
> ```npm start```

## 包裝成Docker運行
> ```docker-compose up --build```
