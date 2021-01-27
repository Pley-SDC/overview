#!/bin/bash

# Upload this script as "user data" as part of the instance creation process.
# This sets up the script to run automatically when the instance is initialized.
# Note: configured for AWS linux 2 instance

# Note: this script will be run from /var/lib/cloud/instances/instance-id/ on initial setup of the instance (it will not run on a restart)
# A log of the script output will be stored at /var/log/cloud-init-output.log
# Ultimately your working directory on the instance will become /home/ec2-user

# update package manager
sudo yum update -y

# install git
sudo yum install git -y

mkdir -p /home/ec2-user
export HOME="/home/ec2-user"
# clone server repo
cd $HOME
git clone https://github.com/Pley-SDC/overview.git

# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# make nvm command available to current shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# install node
nvm install lts/carbon

# install mongodb-community
sudo touch '/etc/yum.repos.d/mongodb-org-4.2.repo'
sudo printf "[mongodb-org-4.2]\nname=MongoDB Repository\nbaseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/4.2/x86_64/\ngpgcheck=1\nenabled=1\ngpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc\n" >> '/etc/yum.repos.d/mongodb-org-4.2.repo'
sudo yum install -y mongodb-org
sudo systemctl start mongod
# verify that mongo has started successfully
sudo systemctl status mongod

# all these commands are run, and therefore owned, by the "root" user
# This command will change the owner to the default user
sudo chown -R ec2-user /home/ec2-user/overview
sudo chown -R ec2-user:$(id -gn ec2-user) /home/ec2-user/.config

# install server dependencies
cd overview
git checkout finding-bottlenecks-demo
npm install

# TODO: add changes to database configuration to make db listen for external connections

# Run server
# npm run build
# npm start

# Still need to manually run the line below:
# scp -i "SDC.pem" ~/hackreactor/projects/SDC/overview/newrelic.js ec2-user@ec2-3-101-13-52.us-west-1.compute.amazonaws.com:/home/ec2-user/overview

# Also need to run this to allow my server to run on port 80
# iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000