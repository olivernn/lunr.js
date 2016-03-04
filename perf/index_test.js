(function () {
  var setup = function () {
    var testDoc = {
      id: 1,
      title: 'Adding story from last story in the sprint',
      body: 'So that I am not confused where the story is going to end up As a user I want the the add a story button from the last story in the sprint to create a story at the top of the backlog and not extend the sprint temporarily the add story button inserts a story at the top of the backlog. "add a new story here" prompts are not shown for stories that are currently in a sprint',
      tags: 'foo bar'
    }
    var testDocLarge = {
      id: 1,
      title: 'Adding story from last story in the sprint',
      body: "Release Notes\n\uf0c1\n\n\n\n\nUpgrading\n\uf0c1\n\n\nTo upgrade MkDocs to the latest version, use pip:\n\n\npip install -U mkdocs\n\n\n\nYou can determine your currently installed version using \nmkdocs --version\n:\n\n\n$ mkdocs --version\nmkdocs, version 0.15.2\n\n\n\nVersion 0.15.3 (2016-02-18)\n\uf0c1\n\n\n\n\nImprove the error message the given theme can't be found.\n\n\nFix an issue with relative symlinks (#639)\n\n\n\n\nVersion 0.15.2 (2016-02-08)\n\uf0c1\n\n\n\n\nFix an incorrect warning that states external themes \nwill be removed from\n  MkDocs\n.\n\n\n\n\nVersion 0.15.1 (2016-01-30)\n\uf0c1\n\n\n\n\nLower the minimum supported Click version to 3.3 for package maintainers.\n  (#763)\n\n\n\n\nVersion 0.15.0 (2016-01-21)\n\uf0c1\n\n\nMajor Additions to Version 0.15.0\n\uf0c1\n\n\nAdd support for installable themes\n\uf0c1\n\n\nMkDocs now supports themes that are distributed via Python packages. With this\naddition, the Bootstrap and Bootswatch themes have been moved to external git\nrepositories and python packages. See their individual documentation for more\ndetails about these specific themes.\n\n\n\n\nMkDocs Bootstrap\n\n\nMkDocs Bootswatch\n\n\n\n\nThey will be included with MkDocs by default until the 1.0 release. After that\nthey will be installable with pip: \npip install mkdocs-bootstrap\n and \npip\ninstall mkdocs-bootswatch\n\n\nSee the documentation for \nStyling your docs\n for more information about using\nand customising themes and \nCustom themes\n for creating and distributing new\nthemes\n\n\nOther Changes and Additions to Version 0.15.0\n\uf0c1\n\n\n\n\nFix issues when using absolute links to Markdown files. (#628)\n\n\nDeprecate support of Python 2.6, pending removal in 1.0.0. (#165)\n\n\nAdd official support for Python version 3.5.\n\n\nAdd support for \nsite_description\n and \nsite_author\n to the \nReadTheDocs\n\n  theme. (#631)\n\n\nUpdate FontAwesome to 4.5.0. (#789)\n\n\nIncrease IE support with X-UA-Compatible. (#785)\n\n\nAdded support for Python's \n-m\n flag. (#706)\n\n\nBugfix: Ensure consistent ordering of auto-populated pages. (#638)\n\n\nBugfix: Scroll the tables of contents on the MkDocs theme if it is too long\n  for the page. (#204)\n\n\nBugfix: Add all ancestors to the page attribute \nancestors\n rather than just\n  the initial one. (#693)\n\n\nBugfix: Include HTML in the build output again. (#691)\n\n\nBugfix: Provide filename to Read the Docs. (#721 and RTD#1480)\n\n\nBugfix: Silence Click's unicode_literals warning. (#708)\n\n\n\n\nVersion 0.14.0 (2015-06-09)\n\uf0c1\n\n\n\n\nImprove Unicode handling by ensuring that all config strings are loaded as\n  Unicode. (#592)\n\n\nRemove dependancy on the six library. (#583)\n\n\nRemove dependancy on the ghp-import library. (#547)\n\n\nAdd \n--quiet\n and \n--verbose\n options to all subcommands. (#579)\n\n\nAdd short options (\n-a\n) to most command line options. (#579)\n\n\nAdd copyright footer for readthedocs theme. (#568)\n\n\nIf the requested port in \nmkdocs serve\n is already in use, don't show the\n  user a full stack trace. (#596)\n\n\nBugfix: Fix a JavaScript encoding problem when searching with spaces. (#586)\n\n\nBugfix: gh-deploy now works if the mkdocs.yml is not in the git repo root.\n  (#578)\n\n\nBugfix: Handle (pass-through instead of dropping) HTML entities while\n  parsing TOC. (#612)\n\n\nBugfix: Default extra_templates to an empty list, don't automatically\n  discover them. (#616)\n\n\n\n\nVersion 0.13.3 (2015-06-02)\n\uf0c1\n\n\n\n\nBugfix: Reduce validation error to a warning if the site_dir is within\n  the docs_dir as this shouldn't cause any problems with building but will\n  inconvenience users building multiple times. (#580)\n\n\n\n\nVersion 0.13.2 (2015-05-30)\n\uf0c1\n\n\n\n\nBugfix: Ensure all errors and warnings are logged before exiting. (#536)\n\n\nBugfix: Fix compatibility issues with ReadTheDocs. (#554)\n\n\n\n\nVersion 0.13.1 (2015-05-27)\n\uf0c1\n\n\n\n\nBugfix: Fix a problem with minimal configurations which only contain a list\n  of paths in the pages config. (#562)\n\n\n\n\nVersion 0.13.0 (2015-05-26)\n\uf0c1\n\n\nDeprecations to Version 0.13.0\n\uf0c1\n\n\nDeprecate the JSON command\n\uf0c1\n\n\nIn this release the  \nmkdocs json\n command has been marked as deprecated and\nwhen used a deprecation warning will be shown. It will be removed in a \nfuture\nrelease\n of MkDocs, version 1.0 at the latest. The \nmkdocs json\n command\nprovided  a convenient way for users to output the documentation contents as\nJSON files but with the additions of search to MkDocs this functionality is\nduplicated.\n\n\nA new index with all the contents from a MkDocs build is created in the\n\nsite_dir\n, so with the default value for the \nsite_dir\n It can be found in\n\nsite/mkdocs/search_index.json\n.\n\n\nThis new file is created on every MkDocs build (with \nmkdocs build\n) and\nno configuration is needed to enable it.\n\n\nChange the pages configuration\n\uf0c1\n\n\nProvide a \nnew way\n to define pages, and specifically \nnested pages\n, in the\nmkdocs.yml file and deprecate the existing approach, support will be removed\nwith MkDocs 1.0.\n\n\nWarn users about the removal of builtin themes\n\uf0c1\n\n\nAll themes other than mkdocs and readthedocs will be moved into external\npackages in a future release of MkDocs. This will enable them to be more easily\nsupported and updates outside MkDocs releases.\n\n\nMajor Additions to Version 0.13.0\n\uf0c1\n\n\nSearch\n\uf0c1\n\n\nSupport for search has now been added to MkDocs. This is based on the\nJavaScript library \nlunr.js\n. It has been added to both the \nmkdocs\n and\n\nreadthedocs\n themes. See the custom theme documentation on \nsupporting search\n\nfor adding it to your own themes.\n\n\nNew Command Line Interface\n\uf0c1\n\n\nThe command line interface for MkDocs has been re-written with the Python\nlibrary \nClick\n. This means that MkDocs now has an easier to use interface\nwith better help output.\n\n\nThis change is partially backwards incompatible as while undocumented it was\npossible to pass any configuration option to the different commands. Now only\na small subset of the configuration options can be passed to the commands. To\nsee in full commands and available arguments use \nmkdocs --help\n and\n\nmkdocs build --help\n to have them displayed.\n\n\nSupport Extra HTML and XML files\n\uf0c1\n\n\nLike the \nextra_javascript\n and \nextra_css\n configuration options, a new\noption named \nextra_templates\n has been added. This will automatically be\npopulated with any \n.html\n or \n.xml\n files in the project docs directory.\n\n\nUsers can place static HTML and XML files and they will be copied over, or they\ncan also use Jinja2 syntax and take advantage of the \nglobal variables\n.\n\n\nBy default MkDocs will use this approach to create a sitemap for the\ndocumentation.\n\n\nOther Changes and Additions to Version 0.13.0\n\uf0c1\n\n\n\n\nAdd support for \nMarkdown extension configuration options\n. (#435)\n\n\nMkDocs now ships Python \nwheels\n. (#486)\n\n\nOnly include the build date and MkDocs version on the homepage. (#490)\n\n\nGenerate sitemaps for documentation builds. (#436)\n\n\nAdd a clearer way to define nested pages in the configuration. (#482)\n\n\nAdd an \nextra config\n option for passing arbitrary variables to the template. (#510)\n\n\nAdd \n--no-livereload\n to \nmkdocs serve\n for a simpler development server. (#511)\n\n\nAdd copyright display support to all themes (#549)\n\n\nAdd support for custom commit messages in a \nmkdocs gh-deploy\n (#516)\n\n\nBugfix: Fix linking to media within the same directory as a markdown file\n  called index.md (#535)\n\n\nBugfix: Fix errors with unicode filenames (#542).\n\n\n\n\nVersion 0.12.2 (2015-04-22)\n\uf0c1\n\n\n\n\nBugfix: Fix a regression where there would be an error if some child titles\n  were missing but others were provided in the pages config. (#464)\n\n\n\n\nVersion 0.12.1 (2015-04-14)\n\uf0c1\n\n\n\n\nBugfix: Fixed a CSS bug in the table of contents on some browsers where the\n  bottom item was not clickable.\n\n\n\n\nVersion 0.12.0 (2015-04-14)\n\uf0c1\n\n\n\n\nDisplay the current MkDocs version in the CLI output. (#258)\n\n\nCheck for CNAME file when using gh-deploy. (#285)\n\n\nAdd the homepage back to the navigation on all themes. (#271)\n\n\nAdd a strict more for local link checking. (#279)\n\n\nAdd Google analytics support to all themes. (#333)\n\n\nAdd build date and MkDocs version to the ReadTheDocs and MkDocs theme\n  outputs. (#382)\n\n\nStandardise highlighting across all themes and add missing languages. (#387)\n\n\nAdd a verbose flag. (-v) to show more details about what the build. (#147)\n\n\nAdd the option to specify a remote branch when deploying to GitHub. This\n  enables deploying to GitHub pages on personal and repo sites. (#354)\n\n\nAdd favicon support to the ReadTheDocs theme HTML. (#422)\n\n\nAutomatically refresh the browser when files are edited. (#163)\n\n\nBugfix: Never re-write URL's in code blocks. (#240)\n\n\nBugfix: Don't copy ditfiles when copying media from the \ndocs_dir\n. (#254)\n\n\nBugfix: Fix the rendering of tables in the ReadTheDocs theme. (#106)\n\n\nBugfix: Add padding to the bottom of all bootstrap themes. (#255)\n\n\nBugfix: Fix issues with nested Markdown pages and the automatic pages\n  configuration. (#276)\n\n\nBugfix: Fix a URL parsing error with GitHub enterprise. (#284)\n\n\nBugfix: Don't error if the mkdocs.yml is completely empty. (#288)\n\n\nBugfix: Fix a number of problems with relative urls and Markdown files. (#292)\n\n\nBugfix: Don't stop the build if a page can't be found, continue with other\n  pages. (#150)\n\n\nBugfix: Remove the site_name from the page title, this needs to be added\n  manually. (#299)\n\n\nBugfix: Fix an issue with table of contents cutting off Markdown. (#294)\n\n\nBugfix: Fix hostname for BitBucket. (#339)\n\n\nBugfix: Ensure all links end with a slash. (#344)\n\n\nBugfix: Fix repo links in the readthedocs theme. (#365)\n\n\nBugfix: Include jQuery locally to avoid problems using MkDocs offline. (#143)\n\n\nBugfix: Don't allow the docs_dir to be in the site_dir or vice versa. (#384)\n\n\nBugfix: Remove inline CSS in the ReadTheDocs theme. (#393)\n\n\nBugfix: Fix problems with the child titles due to the order the pages config\n  was processed. (#395)\n\n\nBugfix: Don't error during live reload when the theme doesn't exist. (#373)\n\n\nBugfix: Fix problems with the Meta extension when it may not exist. (#398)\n\n\nBugfix: Wrap long inline code otherwise they will run off the screen. (#313)\n\n\nBugfix: Remove HTML parsing regular expressions and parse with HTMLParser to\n  fix problems with titles containing code. (#367)\n\n\nBugfix: Fix an issue with the scroll to anchor causing the title to be hidden\n  under the navigation. (#7)\n\n\nBugfix: Add nicer CSS classes to the HTML tables in bootswatch themes. (#295)\n\n\nBugfix: Fix an error when passing in a specific config file with\n  \nmkdocs serve\n. (#341)\n\n\nBugfix: Don't overwrite index.md diles with the \nmkdocs new\n command. (#412)\n\n\nBugfix: Remove bold and italic from code in the ReadTheDocs theme. (#411)\n\n\nBugfix: Display images inline in the MkDocs theme. (#415)\n\n\nBugfix: Fix problems with no-highlight in the ReadTheDocs theme. (#319)\n\n\nBugfix: Don't delete hidden files when using \nmkdocs build --clean\n. (#346)\n\n\nBugfix: Don't block newer verions of Python-markdown on Python \n= 2.7. (#376)\n\n\nBugfix: Fix encoding issues when opening files across platforms. (#428)\n\n\n\n\nVersion 0.11.1 (2014-11-20)\n\uf0c1\n\n\n\n\nBugfix: Fix a CSS wrapping issue with code highlighting in the ReadTheDocs\n  theme. (#233)\n\n\n\n\nVersion 0.11.0 (2014-11-18)\n\uf0c1\n\n\n\n\nRender 404.html files if they exist for the current theme. (#194)\n\n\nBugfix: Fix long nav bars, table rendering and code highlighting in MkDocs\n  and ReadTheDocs themes. (#225)\n\n\nBugfix: Fix an issue with the google_analytics code. (#219)\n\n\nBugfix: Remove \n__pycache__\n from the package tar. (#196)\n\n\nBugfix: Fix markdown links that go to an anchor on the current page. (#197)\n\n\nBugfix: Don't add \nprettyprint well\n CSS classes to all HTML, only add it in\n  the MkDocs theme. (#183)\n\n\nBugfix: Display section titles in the ReadTheDocs theme. (#175)\n\n\nBugfix: Use the polling observer in watchdog so rebuilding works on\n  filesystems without inotify. (#184)\n\n\nBugfix: Improve error output for common configuration related errors. (#176)\n\n\n\n\nVersion 0.10.0 (2014-10-29)\n\uf0c1\n\n\n\n\nAdded support for Python 3.3 and 3.4. (#103)\n\n\nConfigurable Python-Markdown extensions with the config setting\n  \nmarkdown_extensions\n. (#74)\n\n\nAdded \nmkdocs json\n command to output your rendered\n  documentation as json files. (#128)\n\n\nAdded \n--clean\n switch to \nbuild\n, \njson\n and \ngh-deploy\n commands to\n  remove stale files from the output directory. (#157)\n\n\nSupport multiple theme directories to allow replacement of\n  individual templates rather than copying the full theme. (#129)\n\n\nBugfix: Fix \nul\n rendering in readthedocs theme. (#171)\n\n\nBugfix: Improve the readthedocs theme on smaller displays. (#168)\n\n\nBugfix: Relaxed required python package versions to avoid clashes. (#104)\n\n\nBugfix: Fix issue rendering the table of contents with some configs. (#146)\n\n\nBugfix: Fix path for embedded images in sub pages. (#138)\n\n\nBugfix: Fix \nuse_directory_urls\n config behaviour. (#63)\n\n\nBugfix: Support \nextra_javascript\n and \nextra_css\n in all themes. (#90)\n\n\nBugfix: Fix path-handling under Windows. (#121)\n\n\nBugfix: Fix the menu generation in the readthedocs theme. (#110)\n\n\nBugfix: Fix the mkdocs command creation under Windows. (#122)\n\n\nBugfix: Correctly handle external \nextra_javascript\n and \nextra_css\n. (#92)\n\n\nBugfix: Fixed favicon support. (#87)",
      tags: 'foo bar'
    }

    questionsIdx.version = lunr.version

    var idx = lunr.Index.load(questionsIdx)
  }

  bench('index#add small', function () {
    idx.add(testDoc)
  }, { setup: setup })

  bench('index#add large', function(){
    idx.add(testDocLarge)
  }, { setup: setup})

  bench('index#search uncommon word', function () {
    idx.search('checkbox')
  }, { setup: setup })

  bench('index#search common word', function () {
    idx.search('javascript')
  }, { setup: setup })

})()

