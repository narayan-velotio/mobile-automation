describe('Android Find Elements', () => {
    it('Find elements by accessibility id', async() => {
        // Find element by accessibility id
        const appOption = await $('~App');

        // Click on the element
        await appOption.click();

        // Assert 
        const actionBar = await $('~Action Bar');
        await expect(actionBar).toBeExisting();
    });

    it('Find elements by class name', async() => {
        // Find element by class name
        const className = await $('android.widget.TextView');

        // Assert
        await expect(className).toHaveText('API Demos');
    });

    it('Find elements by xpath', async() => {
        // Find element by xpath
        await $('//android.widget.TextView[@content-desc="Alert Dialogs"]').click();

        // Find by resource id
        await $('//android.widget.Button[@resource-id="io.appium.android.apis:id/select_button"]').click();

        // Find by text
        await $('//android.widget.TextView[@text="Command two"]').click();

        // Assert using classname
        const text = await $('android.widget.TextView');
        await expect(text).toHaveText('You selected: 1 , Command two');
    });
});