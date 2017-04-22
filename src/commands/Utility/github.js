const got = require('got');

exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        throw 'You must specify a repository or search term!';
    }

    if (args[0].indexOf('/') !== -1) {

        let repo = safeRepo(args[0]);

        msg.edit(`:arrows_counterclockwise:  Loading info for '${repo}'...`);

        got(`https://api.github.com/repos/${repo}`).then(res => {
            let json = JSON.parse(res.body);
            if (json.message === 'Not Found') {
                msg.error('That repository could not be found!');
            }

            msg.edit('', { embed: bot.utils.embed('', getInfo(json)) });
        });

    } else {

        msg.edit(`:arrows_counterclockwise:  Searching for '${args.join(' ')}'...`);

        got(`https://api.github.com/search/repositories?q=${args.join('+')}`).then(res => {
            let json = JSON.parse(res.body);
            if (json.total_count < 1) {
                msg.edit(`:sob: No results found for '${args.join(' ')}'`).then(m => m.delete(2000));
                return;
            }

            msg.delete();
            msg.channel.sendMessage(':white_check_mark: Top 3 results:');

            for (let i = 0; i < 3; i++) {
                if (!json.items[i]) {
                    break;
                }
                let item = json.items[i];
                msg.channel.sendMessage('', { embed: bot.utils.embed('', getInfo(item)) });
            }
        });

    }

};

function safeRepo(input) {
    if (input.indexOf('/') === -1) {
        return;
    }
    let user = input.substr(0, input.indexOf('/'));
    input = input.substr(input.indexOf('/') + 1);
    let repo = input.indexOf('/') === -1 ? input : input.substr(0, input.indexOf('/'));
    return `${user}/${repo}`;
}

function getInfo(json) {
    return `**${json.full_name}**

\t**Description:** _${json.description || 'None provided'}_
\t**Owner:** [${json.owner.login}](${json.owner.html_url})
\t**Primary Language:** \`${json.language}\`

\t:house:  [Home page](${json.html_url})  :small_red_triangle_down:  [Downloads](${json.html_url}/releases)  :exclamation:  [Issues](${json.html_url}/issues)

\t:negative_squared_cross_mark:  \`${json.open_issues_count}\` open issues  :star:  \`${json.stargazers_count}\` stargazers  :eyes:  \`${json.subscribers_count || json.watchers_count}\` watchers


\tDo \`git clone ${json.clone_url}\` to clone this repository
`;
}

exports.info = {
    name: 'github',
    usage: 'github user/repo',
    description: 'Links to a GitHub repository'
};
