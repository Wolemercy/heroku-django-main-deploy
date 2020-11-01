const core = require('@actions/core');
const { execSync, } = require('child_process')
//Variables
let heroku = {
    'app_name': core.getInput('heroku_app_name'),
    'api_key': core.getInput('heroku_api_key'),
    'email_address': core.getInput('heroku_email_address'),
    'want_to_login': core.getInput('want_to_login')
}

const createNetrcFileForLogin = ({ email_address, api_key }) => {
    return execSync(`cat >~/.netrc <<EOF
machine api.heroku.com
  login ${email_address}
  password ${api_key}
machine git.heroku.com
  login ${email_address}
  password ${api_key}
        `);
}
const login = () => {
    try {
        createNetrcFileForLogin(heroku);
        console.log('Created file and wrote to ~/.netrc');

        execSync("heroku auth:whoami", (error, stdout, stderr) => {
            if (error) {
                console.log(`exec error: ${error}`);
                core.setFailed(`exec error: ${error}`);
            } else if (stderr) {
                console.log(`stderr: ${stderr}`);
                core.setFailed(`stderr: ${stderr}`);
            }
            console.log('Logged in successfully');
            console.log(`stdout Logged in successfully with user: ${stdout}`);
        });

    } catch (err) {
        console.log(err);
        core.setFailed(`${err} Failed to Login with provided credentials. `);
        console.log('Failed to Login with provided credentials');
    }
}

//Run Login
if (heroku.want_to_login) {
    login();
    return;
}

core.setOutput(
    "status",
    "Successfully deployed app from branch"
);

