" Vim config by CrisForno

set nocompatible              " be iMproved, required

call plug#begin('~/.vim/plugged')

" Make sure you use single quotes

" Shorthand notation; fetches https://github.com/junegunn/vim-easy-align
Plug 'junegunn/vim-easy-align'

" Any valid git URL is allowed
Plug 'https://github.com/junegunn/vim-github-dashboard.git'

" Multiple Plug commands can be written in a single line using | separators
Plug 'SirVer/ultisnips' | Plug 'honza/vim-snippets'

" On-demand loading
Plug 'scrooloose/nerdtree', { 'on':  'NERDTreeToggle' }
Plug 'tpope/vim-fireplace', { 'for': 'clojure' }

" Using a non-master branch
Plug 'rdnetto/YCM-Generator', { 'branch': 'stable' }

" Using a tagged release; wildcard allowed (requires git 1.9.2 or above)
Plug 'fatih/vim-go', { 'tag': '*' }

" Plugin options
Plug 'nsf/gocode', { 'tag': 'v.20150303', 'rtp': 'vim' }

" Plugin outside ~/.vim/plugged with post-update hook
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }

" Unmanaged plugin (manually installed and updated)
Plug '~/my-prototype-plugin'

" AIRLINE
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

" GRUNDO
Plug 'sjl/gundo.vim'

" Initialize plugin system
call plug#end()

" AIRLINE
let g:airline_theme='bubblegum'
set laststatus=2

" CtrlP
set runtimepath^=~/dotfiles/vim/bundle/ctrlp.vim

"COLOR

" Preferred color scheme
colorscheme solarized

" FORMATTING

" encoding
set encoding=utf8

" enable syntax processing
syntax enable

" number of spaces per TAB
set tabstop=4
set shiftwidth=4

" smart formatting
set smarttab
set autoindent
set smartindent

" number of spaces in tab when editing
set softtabstop=4

" use tabs, not spaces
set noexpandtab

" make backspace work like most other apps
set backspace=2
set backspace=indent,eol,start

" UI CONFIG

" show number lines
set number

" show command in bottom bar
set showcmd

" highlight current line
set cursorline

" This both turns on filetype detection and allows loading of language specific indentation files based on that detection.
filetype indent on

" visual autocomplete for command menu
set wildmenu

" highlight matching [{()}]
set showmatch

" show where you are in the file
set ruler

" Height of the commmand bar
set cmdheight=1

" SEARCHING

" search as characters are entered
set incsearch

" highlight matches
set hlsearch

" turn off search highlight
nnoremap <leader><space> :nohlsearch<CR>

" KEYBINDINGS

" leader is a comma
let mapleader=","

" move vertically by visual line
nnoremap j gj
nnoremap k gk

" move to beginning/end of line
nnoremap B ^
nnoremap E $

" $/^ doesn't do anything
nnoremap $ <nop>
nnoremap ^ <nop>

" quit vim without saving
nnoremap qq :q!<ENTER>

" center cursor
nnoremap <C-l> z.

" toggle gundo
 nnoremap <leader>u :GundoToggle<CR>

" BACKUPS

" I don't like backups
set nobackup
set nowritebackup
set noswapfile

" FONTS

set guifont=Hack:h14,Source\ Code\ Pro:h15,Menlo:h15

" AUTOCOMPLETE

" Map auto complete of (, ", ', [
inoremap $1 ()<esc>i
inoremap $2 []<esc>i
inoremap $3 {}<esc>i
inoremap $4 {<esc>o}<esc>O
inoremap $q ''<esc>i
inoremap $e ""<esc>i
