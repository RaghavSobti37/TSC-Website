#!/bin/bash

# TSC Website - Universal Design Reference Tool
# Quick access to UI UX Pro Max design library

PYTHON="/c/Users/ragha/AppData/Local/Programs/Python/Python313/python"
LIBRARY_PATH="/c/Users/ragha/OneDrive/Desktop/ui-ux-pro-max-skill"
SEARCH_SCRIPT="$LIBRARY_PATH/src/ui-ux-pro-max/scripts/search.py"

# Colors for output
BOLD='\033[1m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Help function
show_help() {
    echo -e "${BOLD}TSC Design Reference - Quick Commands${NC}\n"

    echo -e "${BLUE}Usage:${NC} ./design-reference.sh [command] [query]\n"

    echo -e "${BOLD}Search by Domain:${NC}"
    echo "  ./design-reference.sh style 'glassmorphism'"
    echo "  ./design-reference.sh color 'dark cinema'"
    echo "  ./design-reference.sh typography 'luxury brands'"
    echo "  ./design-reference.sh landing 'hero conversion'"
    echo "  ./design-reference.sh ux 'navigation patterns'"
    echo "  ./design-reference.sh product 'artist platform'"
    echo ""

    echo -e "${BOLD}Search by Stack:${NC}"
    echo "  ./design-reference.sh nextjs 'button animation'"
    echo "  ./design-reference.sh react 'card component'"
    echo ""

    echo -e "${BOLD}TSC Project Templates:${NC}"
    echo "  ./design-reference.sh tsc-glassmorphic   (Navbar patterns)"
    echo "  ./design-reference.sh tsc-waves          (Wave animation)"
    echo "  ./design-reference.sh tsc-artist         (Artist platform)"
    echo "  ./design-reference.sh tsc-dark           (Dark theme)"
    echo "  ./design-reference.sh tsc-typography     (Premium fonts)"
    echo ""
}

# TSC Quick Reference Templates
case "$1" in
    tsc-glassmorphic)
        echo -e "${GREEN}=== TSC Glassmorphic Navbar Reference ===${NC}\n"
        $PYTHON "$SEARCH_SCRIPT" "glassmorphism premium frosted glass navigation" --domain style
        ;;
    tsc-waves)
        echo -e "${GREEN}=== TSC Wave Animation Patterns ===${NC}\n"
        $PYTHON "$SEARCH_SCRIPT" "organic wave animation interactive buttons motion" --domain ux
        ;;
    tsc-artist)
        echo -e "${GREEN}=== TSC Artist Platform Best Practices ===${NC}\n"
        $PYTHON "$SEARCH_SCRIPT" "artist creator portfolio platform ecosystem" --domain product
        ;;
    tsc-dark)
        echo -e "${GREEN}=== TSC Dark Cinema Theme ===${NC}\n"
        $PYTHON "$SEARCH_SCRIPT" "dark cinema cinematic video background luxury" --domain color
        ;;
    tsc-typography)
        echo -e "${GREEN}=== TSC Premium Typography ===${NC}\n"
        $PYTHON "$SEARCH_SCRIPT" "luxury creative artist editorial premium" --domain typography
        ;;
    style|color|typography|landing|chart|ux|product)
        if [ -z "$2" ]; then
            echo -e "${YELLOW}Please provide a query${NC}"
            show_help
        else
            $PYTHON "$SEARCH_SCRIPT" "$2" --domain "$1" -n 3
        fi
        ;;
    nextjs|react|astro|vue|vue-nuxt|svelte|html-tailwind)
        if [ -z "$2" ]; then
            echo -e "${YELLOW}Please provide a query${NC}"
            show_help
        else
            $PYTHON "$SEARCH_SCRIPT" "$2" --stack "$1" -n 3
        fi
        ;;
    *)
        show_help
        ;;
esac
