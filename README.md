# Screen Guru 🔮

> Take clean screenshot of any websites. — https://screen.guru

- 🎨 Custom background color
- 🖥 Browser template
- ⚡️ Emoji ready (with [Emojione font](https://github.com/emojione/emojione-assets))

[![Screeshot](https://user-images.githubusercontent.com/1102595/50456960-4de2ec00-0958-11e9-8f50-598b1eceb026.png)](https://screen.guru)

**Bookmarklet**

```
javascript:location.href='https://screen.guru?url='+encodeURIComponent(location.href)
```

## Getting started

**Stack**

- ⚛️ [Create React App](https://facebook.github.io/create-react-app/)
- ✨ [Amazon Lambda](https://aws.amazon.com/fr/lambda/)
- 📸 [Puppeteer](https://github.com/GoogleChrome/puppeteer)
- ☁️ [Serverless](https://serverless.com/)
- 🏡 [Netlify](https://netlify.com)

**Install dependencies**

```sh
yarn install
```

**Build app**

```sh
yarn build
# Deploy the static app with Netlify / Surge.sh / Zeit
```

**Deploy lambda on AWS**

With [serverless](https://serverless.com/):

```sh
yarn global add serverless

cd lambda/screenshot

# serverless config credentials –provider aws –key XXX –secret XXX
# this is DEPRECATED changed to (use menu to enter AWS credentials):
serverless

yarn
yarn add --dev serverless-apigwy-binary serverless-apigw-binary
yarn build-lambda-sharp

serverless deploy
```

Update the env var `REACT_APP_LAMBDA_ENDPOINT` (in `.env`) with your lambda endpoint


Carrot quest notes
==================
1. I built this project in WSL environment.
2. Node 18 should be installed. For some reason, on v22 I got `unsupported` errors during `yarn build`. 
   a. I used node v18.20.7 and yarn 1.22.22
3. serverless now requires an account. You can ask Mikhail Shvein for credentials. Email is `services@carrotquest.io`.
4. `serverless config...` has changed. Now just type `serverless`, and use menu to enter AWS credentials.
5. `REACT_APP_LAMBDA_ENDPOINT` should contain AWS result path. For example `https://k63lbhzo6e.execute-api.eu-west-1.amazonaws.com/production/screenshot`.
