
import { updateService, createService, getAllServicesAdmin } from './src/app/actions/services';

async function verify() {
    console.log("Verifying service actions...");

    // 1. Create a test service
    console.log("1. Creating test service...");
    const createResult = await createService({
        name: "Test Service",
        description: "Test Description",
        icon: "🧪",
        price: 100,
        features: ["Test Feature"]
    });

    if (!createResult.success) {
        console.error("❌ Create failed:", createResult.error);
        return;
    }
    console.log("✅ Create successful");

    // 2. Get the service ID
    const servicesResult = await getAllServicesAdmin();
    const service = servicesResult.services.find(s => s.name === "Test Service");

    if (!service) {
        console.error("❌ Could not find created service");
        return;
    }
    console.log(`Found service ID: ${service.id}`);

    // 3. Update the service
    console.log("2. Updating service...");
    const updateResult = await updateService(service.id, {
        name: "Updated Service",
        description: "Updated Description",
        icon: "🧪",
        price: 200,
        features: ["Updated Feature"]
    });

    if (!updateResult.success) {
        console.error("❌ Update failed:", updateResult.error);
    } else {
        console.log("✅ Update successful");
    }
}

verify().catch(console.error);
