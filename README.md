# Week 8: Netlify Dev Install and Test

1. Install node.js – https://nodejs.org and choose the "Current" version. Open the installer and complete the steps using defaults only (note: if prompted to install "Tools for Native Modules", skip it; do not check the box, just click "Next").
1. If you haven't already done so, create a new repository in your GitHub account by selecting "Use this template"; call the new repository "week8" and clone/open the new repo in VSCode.
1. In VSCode, open a new Terminal window via the menu bar -> Terminal -> New Terminal. In the Terminal, ensure that Node was successfully installed by typing `node -v` and hit Enter. A version number (e.g. `v15.10.0`) should be returned.  If it isn't, ask for help in slack.
1. Install the Netlify developer tools. In the terminal window, type `npm install netlify-cli -g` and hit Enter. It should take a couple of minutes. Afterwards, type `netlify -v` to ensure the installation was successful.  The installed tool and version number (e.g. `netlify-cli/3.8.6 linux-x64 node-v14.15.5`) should be returned.  If it isn't, ask for help in slack.
1. Type `npm install` to install the rest of the dependencies (libraries of code) needed for the project.  You should see "0 vulnerabilities" in the output.
1. Last command - type `netlify dev`. A browser window should pop up with the contents of `index.html`.

**You'll positively 💯 know if the setup worked - the success page is very obvious.**

Now that everything is installed and working, you can end the terminal session by typing the keys CTRL+C in the terminal window (note: if prompted to "Terminate Batch Job?", type "Y" and hit Enter).  This will stop the Netlify Dev server.  You're ready for class!

## For Windows users only

If the `netlify dev` command doesn't work and you don't see the success page, you can try one of two fixes:

- In your Terminal window in VSCode, there's a little dropdown; select the option to "select a default shell". Select cmd and close and re-open the Terminal window.
- If that doesn't work, do everything outside of VSCode using the Command Prompt that's built into Windows: Start Menu -> type `cmd`. Then change into the week8 directory typing `cd \path\to\code\week8` (`cd ` with a space, then the file path to your week8 folder), and then go through the instructions above.
