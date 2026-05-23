using Microsoft.JSInterop;
using System.Text.Json;

public class UserService
{
    private readonly IJSRuntime _jsRuntime;

    public UserService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public async Task CreateUserDocumentAsync(string uid, string email, string displayName = "", string photoUrl = "")
    {
        if (string.IsNullOrEmpty(uid)) return;

        try
        {
            var userData = new
            {
                uid,
                email = email ?? "",
                displayName = displayName ?? "",
                photoURL = photoUrl ?? "",
                fcmToken = "",
                platform = "web",
                createdAt = "SERVER_TIMESTAMP",   // we'll handle this in JS
                lastUpdated = "SERVER_TIMESTAMP",
                role = "user"
            };

            await _jsRuntime.InvokeVoidAsync("createUserDocument", uid, userData);
            Console.WriteLine("✅ User document created in Firestore!");
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"❌ Error creating user: {ex.Message}");
        }
    }
}