describe('Android Basic Interactions', () => {
    before(async function() {
        // Wait for app to load
        await browser.pause(3000);
    });

    it('should click on different menu items', async () => {
        try {
            await browser.pause(2000);
            
            // Click on App menu
            const appMenu = await $('~App');
            await expect(appMenu).toBeDisplayed();
            await appMenu.click();
            
            // Verify we're on App screen
            const actionBar = await $('~Action Bar');
            await expect(actionBar).toBeExisting();
            
            // Go back to main screen
            await browser.back();
            await browser.pause(1000);
            
            // Click on Content menu
            const contentMenu = await $('~Content');
            await expect(contentMenu).toBeDisplayed();
            await contentMenu.click();
            
            // Verify we're on Content screen
            const assets = await $('~Assets');
            await expect(assets).toBeExisting();
            
        } catch (error) {
            console.error('Error in basic interactions test:', error);
            throw error;
        }
    });

    it('should verify app title and navigation', async () => {
        try {
            await browser.pause(2000);
            
            // Verify app title
            const appTitle = await $('android.widget.TextView');
            await expect(appTitle).toHaveText('API Demos');
            
            // Verify main menu items exist
            const menuItems = await $$('android.widget.TextView');
            expect(menuItems.length).toBeGreaterThan(5);
            
            console.log(`Found ${menuItems.length} menu items on main screen`);
            
        } catch (error) {
            console.error('Error in app title test:', error);
            throw error;
        }
    });
}); 