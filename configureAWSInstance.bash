#!/bin/bash

# run this script with "bash initialize-server.bash > initOutput.txt 2>&1"

# update package manager
sudo yum update -y

# install git
sudo yum install git -y

# clone server repo
git clone https://github.com/Pley-SDC/overview.git

# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# make nvm command available to current shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# install node
nvm install lts/carbon

# install server dependencies
cd overview
git checkout finding-bottlenecks-demo
npm install

# install mongodb-community
sudo touch '/etc/yum.repos.d/mongodb-org-4.2.repo'
sudo printf "[mongodb-org-4.2]\nname=MongoDB Repository\n baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/4.2/x86_64/\ngpgcheck=1\nenabled=1\ngpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc\n" >> '/etc/yum.repos.d/mongodb-org-4.2.repo'
sudo yum install -y mongodb-org
sudo systemctl start mongod
# verify that mongo has started successfully
sudo systemctl status mongod