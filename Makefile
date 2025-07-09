# Mobile Automation Framework Makefile
# Common commands for managing the mobile automation project

.PHONY: help install setup test clean lint format

# Default target
help:
	@echo "Mobile Automation Framework - Available Commands:"
	@echo ""
	@echo "Setup Commands:"
	@echo "  install     - Install project dependencies"
	@echo "  setup       - Setup the project (install + verify)"
	@echo ""
	@echo "Testing Commands:"
	@echo "  test        - Run all tests"
	@echo "  test-spec   - Run specific test file"
	@echo "  test-debug  - Run tests with debug logging"
	@echo ""
	@echo "Development Commands:"
	@echo "  lint        - Run ESLint (if configured)"
	@echo "  format      - Format code with Prettier (if configured)"
	@echo "  clean       - Clean generated files and logs"
	@echo ""
	@echo "Device Management:"
	@echo "  devices     - List connected devices"
	@echo "  start-emu   - Start Android emulator"
	@echo "  kill-adb    - Kill ADB server"
	@echo "  restart-adb - Restart ADB server"
	@echo ""
	@echo "Appium Commands:"
	@echo "  appium      - Start Appium server"
	@echo "  appium-kill - Kill Appium server"
	@echo ""
	@echo "Report Commands:"
	@echo "  report      - Generate Allure report"
	@echo "  report-open - Open Allure report in browser"

# Setup Commands
install:
	@echo "Installing project dependencies..."
	npm install

setup: install
	@echo "Setting up mobile automation framework..."
	@echo "Verifying Android SDK..."
	@which adb || (echo "Error: ADB not found. Please install Android SDK." && exit 1)
	@echo "Verifying Node.js..."
	@node --version || (echo "Error: Node.js not found." && exit 1)
	@echo "Verifying npm..."
	@npm --version || (echo "Error: npm not found." && exit 1)
	@echo "Setup complete! ✅"

# Testing Commands
test:
	@echo "Running all tests..."
	npm run wdio

test-spec:
	@echo "Running specific test file..."
	npm run wdio -- --spec test/specs/test.e2e.js

test-debug:
	@echo "Running tests with debug logging..."
	npm run wdio -- --logLevel debug

# Development Commands
lint:
	@echo "Running ESLint..."
	@if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then \
		npx eslint .; \
	else \
		echo "ESLint not configured. Skipping..."; \
	fi

format:
	@echo "Formatting code with Prettier..."
	@if [ -f ".prettierrc" ] || [ -f ".prettierrc.js" ]; then \
		npx prettier --write .; \
	else \
		echo "Prettier not configured. Skipping..."; \
	fi

clean:
	@echo "Cleaning generated files and logs..."
	@rm -rf allure-results/ allure-report/ screenshots/ videos/ logs/ test-results/ reports/ coverage/
	@rm -f *.log appium.log appium-out.log
	@echo "Clean complete! ✅"

# Device Management Commands
devices:
	@echo "Listing connected devices..."
	adb devices

start-emu:
	@echo "Starting Android emulator..."
	@if [ -z "$(AVD_NAME)" ]; then \
		echo "Please set AVD_NAME environment variable or specify emulator name"; \
		echo "Usage: make start-emu AVD_NAME=Pixel3"; \
		exit 1; \
	fi
	emulator -avd $(AVD_NAME)

kill-adb:
	@echo "Killing ADB server..."
	adb kill-server

restart-adb:
	@echo "Restarting ADB server..."
	adb kill-server
	adb start-server

# Appium Commands
appium:
	@echo "Starting Appium server..."
	appium --base-path /

appium-kill:
	@echo "Killing Appium server..."
	@pkill -f "appium" || echo "No Appium process found"

# Report Commands
report:
	@echo "Generating Allure report..."
	@if command -v allure >/dev/null 2>&1; then \
		allure generate allure-results --clean; \
	else \
		echo "Allure command line tool not found. Installing..."; \
		npm install -g allure-commandline; \
		allure generate allure-results --clean; \
	fi

report-open:
	@echo "Opening Allure report..."
	@if command -v allure >/dev/null 2>&1; then \
		allure open allure-report; \
	else \
		echo "Allure command line tool not found. Please install it first."; \
	fi

# Utility Commands
check-env:
	@echo "Checking environment setup..."
	@echo "Node.js version: $(shell node --version)"
	@echo "npm version: $(shell npm --version)"
	@echo "ADB version: $(shell adb version | head -1)"
	@echo "Connected devices:"
	@adb devices

# CI/CD Commands
ci-setup: install
	@echo "Setting up CI environment..."
	@echo "CI setup complete! ✅"

ci-test: ci-setup
	@echo "Running tests in CI mode..."
	npm run wdio -- --headless

# Documentation Commands
docs:
	@echo "Generating documentation..."
	@if [ -f "docs/README.md" ]; then \
		echo "Documentation already exists."; \
	else \
		echo "Creating documentation structure..."; \
		mkdir -p docs; \
		cp README.md docs/; \
	fi

# Backup Commands
backup:
	@echo "Creating backup of test files..."
	@tar -czf backup-$(shell date +%Y%m%d-%H%M%S).tar.gz test/ wdio.conf.js package.json
	@echo "Backup created! ✅"

# Quick Commands
quick-test:
	@echo "Quick test run..."
	@make devices
	@make test

all: setup test report
	@echo "Complete workflow finished! ✅" 