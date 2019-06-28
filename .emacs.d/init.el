(require 'package)
(let* ((no-ssl (and (memq system-type '(windows-nt ms-dos))
                    (not (gnutls-available-p))))
       (proto (if no-ssl "http" "https")))
  (when no-ssl
    (warn "\
Your version of Emacs does not support SSL connections,
which is unsafe because it allows man-in-the-middle attacks.
There are two things you can do about this warning:
1. Install an Emacs version that does support SSL and be safe.
2. Remove this warning from your init file so you won't see it again."))
  ;; Comment/uncomment these two lines to enable/disable MELPA and MELPA Stable as desired
  (add-to-list 'package-archives (cons "melpa" (concat proto "://melpa.org/packages/")) t)
  ;;(add-to-list 'package-archives (cons "melpa-stable" (concat proto "://stable.melpa.org/packages/")) t)
  (when (< emacs-major-version 24)
    ;; For important compatibility libraries like cl-lib
    (add-to-list 'package-archives (cons "gnu" (concat proto "://elpa.gnu.org/packages/")))))
(package-initialize)

;;=====DASHBOARD=======================
(require 'dashboard);; dashboard
(dashboard-setup-startup-hook)
;; Set the title
(setq dashboard-banner-logo-title "Welcome to Emacs Dashboard")
;; Set the banner
(setq dashboard-startup-banner 3)
(setq show-week-agenda-p t)
;; Content is not centered by default. To center, set
(setq dashboard-center-content t)
;;====================================

;;=======STARTUP OPTIONS=========

(add-to-list 'default-frame-alist '(fullscreen . maximized))
(set-face-attribute 'default nil :height 175)
(which-key-mode)
;;======================

;;=====USEFUL_KEYBINDINGS======

(defun save-all ()
  "Saving all files w/o prompt"
  (interactive)
  (save-some-buffers t)
  )

(global-set-key (kbd "C-x s") 'save-all)

(defun delete-window-balance ()
  "Delete window and rebalance the remaining ones."
  (interactive)
  (delete-window)
  (balance-windows))
(defun split-window-below-focus ()
  "Split window horizontally and move focus to other window."
  (interactive)
  (split-window-below)
  (balance-windows)
  (other-window 1))
(defun split-window-right-focus ()
  "Split window vertically and move focus to other window."
  (interactive)
  (split-window-right)
  (balance-windows)
  (other-window 1))

(global-set-key (kbd "C-0") 'delete-window-balance)
(global-set-key (kbd "C-1") 'delete-other-windows)
(global-set-key (kbd "C-2") 'split-window-below-focus)
(global-set-key (kbd "C-3") 'split-window-right-focus)

;;========================

;;=====SMEX=========

(global-set-key (kbd "M-x") 'smex)

;;=================

;;========REMOTE==========

;;=========================

;;=====MAGIT=========

(global-set-key (kbd "C-x g") 'magit-status)

;;==================

;;======ESHELL==========

(eshell-git-prompt-use-theme 'powerline)

;;======================

;; reduce the frequency of garbage collection by making it happen on
;; each 50MB of allocated data (the default is on every 0.76MB)
(setq gc-cons-threshold 50000000)

;; the toolbar is just a waste of valuable screen estate
;; in a tty tool-bar-mode does not properly auto-load, and is
;; already disabled anyway
(tool-bar-mode -1)
(menu-bar-mode -1)

;; the blinking cursor is nothing, but an annoyance
(blink-cursor-mode -1)

;; disable the annoying bell ring
(setq ring-bell-function 'ignore)

;; disable startup screen
(setq inhibit-startup-screen t)

;; enable y/n answers
(fset 'yes-or-no-p 'y-or-n-p)

;; delete the selection with a keypress
(delete-selection-mode t)

;;highlight parenthases
(show-paren-mode +1)

;; mode line settings
(global-linum-mode t)
(setq linum-format "%4d \u2502 ")
(line-number-mode t)
(column-number-mode t)
(size-indication-mode t)

;; more useful frame title, that show either a file or a
;; buffer name (if the buffer isn't visiting a file)
(setq frame-title-format
      '((:eval (if (buffer-file-name)
                   (abbreviate-file-name (buffer-file-name))
		 "%b"))))

;; Emacs modes typically provide a standard means to change the
;; indentation width -- eg. c-basic-offset: use that to adjust your
;; personal indentation width, while maintaining the style (and
;; meaning) of any files you load.
(setq-default indent-tabs-mode t)   ;; use tabs to indent
(setq-default tab-width 8) ;; but maintain correct appearance
(defvaralias 'c-basic-offset 'tab-width)

(setq default-tab-width 8)


;; smart tab behavior - indent or complete
(setq tab-always-indent 'complete)

(setq make-backup-files nil) ; stop creating backup~ files
(setq auto-save-default nil) ; stop creating #autosave# files

;; scroll one line at a time (less "jumpy" than defaults)

(setq mouse-wheel-scroll-amount '(1 ((shift) . 1))) ;; one line at a time

(setq mouse-wheel-progressive-speed nil) ;; don't accelerate scrolling

(setq mouse-wheel-follow-mouse 't) ;; scroll window under mouse

(setq scroll-step 1) ;; keyboard scroll one line at a time

(and
(require 'centered-cursor-mode)
(global-centered-cursor-mode +1))

(ido-mode 1)

(load-theme 'zenburn t)

(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-safe-themes
   (quote
    ("d057f0430ba54f813a5d60c1d18f28cf97d271fd35a36be478e20924ea9451bd" "a24c5b3c12d147da6cef80938dca1223b7c7f70f2f382b26308eba014dc4833a" "d677ef584c6dfc0697901a44b885cc18e206f05114c8a3b7fde674fce6180879" "8aebf25556399b58091e533e455dd50a6a9cba958cc4ebb0aab175863c25b9a4" "a8245b7cc985a0610d71f9852e9f2767ad1b852c2bdea6f4aadc12cce9c4d6d0" default)))
 '(package-selected-packages
   (quote
    (which-key smex magit better-defaults restart-emacs eshell-git-prompt go-mode dashboard whitespace-cleanup-mode zenburn-theme material-theme solarized-theme thrift centered-cursor-mode))))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
