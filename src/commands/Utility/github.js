const got = require('got');

exports.run = async (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must specify a repository or search term!';
    }

    const input = args.join(' ');

    if (input.indexOf('/') !== -1) {
        let repo = safeRepo(input);

        msg.edit(`:arrows_counterclockwise: Loading info for '${repo}'...`);

        const res = await got(`https://api.github.com/repos/${repo}`, { json: true });
        const json = res.body;
        if (json.message === 'Not Found') {
            msg.error('That repository could not be found!');
        }

        msg.edit({
            embed: bot.utils.embed('', getInfo(json))
        });
    } else {
        msg.edit(`:arrows_counterclockwise: Searching for '${input}'...`);

        const res = await got(`https://api.github.com/search/repositories?q=${args.join('+')}`, { json: true });
        const json = res.body;
        if (json.total_count < 1) {
            throw `No results found for '${args.join(' ')}'`;
        }

        msg.delete();
        msg.channel.send(':white_check_mark: Top 3 results:');

        json.items.slice(0, 3).forEach(item => {
            msg.channel.send({
                embed: bot.utils.embed('', getInfo(item))
            });
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
    usage: 'github <user/repo>',
    description: 'Links to a GitHub repository'
};
