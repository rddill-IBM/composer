/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const chalk = require('chalk');
const cmdUtil = require('../../utils/cmdutils');

/**
 * <p>
 * Composer "network ping" command
 * </p>
 * <p><a href="diagrams/Deploy.svg"><img src="diagrams/deploy.svg" style="width:100%;"/></a></p>
 * @private
 */
class Ping {

  /**
    * Command process for deploy command
    * @param {string} argv argument list from composer command
    * @return {Promise} promise when command complete
    */
    static handler(argv) {
        let businessNetworkConnection;
        let enrollId;
        let enrollSecret;
        let connectionProfileName = argv.connectionProfileName;
        let businessNetworkName;

        return (() => {
            if (!argv.enrollSecret) {
                return cmdUtil.prompt({
                    name: 'enrollmentSecret',
                    description: 'What is the enrollment secret of the user?',
                    required: true,
                    hidden: true,
                    replace: '*'
                })
                .then((result) => {
                    argv.enrollSecret = result.enrollmentSecret;
                });
            } else {
                return Promise.resolve();
            }
        })()
        .then(() => {
            enrollId = argv.enrollId;
            enrollSecret = argv.enrollSecret;
            businessNetworkName = argv.businessNetworkName;
            businessNetworkConnection = cmdUtil.createBusinessNetworkConnection();
            return businessNetworkConnection.connect(connectionProfileName, businessNetworkName, enrollId, enrollSecret);
        })
        .then(() => {
            return businessNetworkConnection.ping();
        })
        .then((result) => {
            console.log(chalk.blue.bold('The connection to the network was successfully tested: ')+businessNetworkName);
            console.log(chalk.blue('\tversion: ') + result.version);
            console.log(chalk.blue('\tparticipant: ') + (result.participant ? result.participant : '<no participant found>'));
        }).catch((error) => {
            throw error;
        });
    }

}

module.exports = Ping;
