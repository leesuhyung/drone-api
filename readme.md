## build a restful api using serverless framework
#### with mongoDB, mongoose, auth0

## setup
```bash
# install mongodb
brew install mongodb

# start service
brew services start mongodb

# ON mongoDB
mongod

# connect mongoDB
mongo

# create collection
use FirstCollection
```

```bash
npm i
```

```bash
# set you are auth0 client id and mongoDB url
cp secrets.json.dist secrets.json
```

```bash
# set you are auth0 client public_key.pem
public_key.pem
```

## usage
scan endpoint
```bash
# option: --aws-profile {profileName}
sls info
```

```bash
# http://localhost:3000
# if 8000 port already in use - kill -9 $(lsof -i TCP:8000| grep LISTEN | awk '{print $2}')
sls offline start
```

## deploy
aws IAM set credentials
```bash
# ~/.aws/credentials
sls config credentials --provider aws --key AKIAIOSFODNN7EXAMPLE --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

```bash
# dev
npm run deploy

# prod
npm run deploy prod
```
