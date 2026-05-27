window.requestNotificationPermission = async function () {

    try {

        const permission =
            await Notification.requestPermission();

        return permission;

    } catch (error) {

        console.error(error);

        return "error";
    }
}