#!/bin/bash -e

ROLE_ARN="$1"
S3_PATH="$2"
PRODUCT="Hyperwave-Integration-Test"
TEAM="Noti-Platform"

CREDENTIALS=$(aws sts assume-role --role-arn ${ROLE_ARN} --role-session-name Hyperwave-Access-Session)
ACCESS_KEY_ID=$(echo ${CREDENTIALS} | jq -r '.Credentials.AccessKeyId')
SECRET_ACCESS_KEY=$(echo ${CREDENTIALS} | jq -r '.Credentials.SecretAccessKey')
SESSION_TOKEN=$(echo ${CREDENTIALS} | jq -r '.Credentials.SessionToken')

REGION="MSY"
FROM="Hyperwave Integration Test <no-reply@recs.jobstreet.com>"
if [[ "${AWS_DEFAULT_REGION}" == "ap-southeast-2" ]]; then
    REGION="AUS"
    FROM="Hyperwave Integration Test <no-reply@seek.com.au>"
fi

EPOCH=$(date +%s)
SUBJECT="${TEAM} ${PRODUCT} - ${EPOCH}"
MIME=$(cat <<-EOF
To: "SEEK" <seek@example.com>
From: ${FROM}
Subject: ${SUBJECT}
MIME-Version: 1.0
Message-Id: <${EPOCH}.${PRODUCT}@${TEAM}.seek.com.au>
Keywords: ${TEAM},${PRODUCT},${REGION},Testdata
User-Agent: Hyperwave-Integration-Test/1
Content-Type: plain/text; charset=utf-8

Hyperwave Integration Test Email.
${TEAM},${PRODUCT},${REGION}

EOF
)

FILE_NAME="${EPOCH}.mime"
UTC_DATE=$(date -u '+%Y-%m-%d')
echo "${MIME}" | AWS_ACCESS_KEY_ID=${ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=${SECRET_ACCESS_KEY} AWS_SESSION_TOKEN=${SESSION_TOKEN} aws s3 cp - "${S3_PATH}/${UTC_DATE}/${FILE_NAME}"

echo "Integration Test Successful!!"
echo "Subject: ${SUBJECT}"