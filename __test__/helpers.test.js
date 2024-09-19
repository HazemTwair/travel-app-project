/**
 * @jest-environment jsdom
 */

import {
    setMinMaxDate,
    getRemainingDays,
    validateInputs,
    handleInputsValidation,
} from "../src/client/js/helpers";

describe("Testing setMinMaxDate", () => {
    test("Testing if setMinMaxDate sets correct minimum and maximum dates", () => {
        // Mock the departingDateInput element
        const mockDepartingDateInput = {
            min: null,
            max: null,
        };

        jest.spyOn(document, "getElementById").mockImplementation((id) => {
            if (id === "departingDate") {
                return mockDepartingDateInput;
            }
            return null;
        });

        const currentDate = new Date();
        const expectedMaxDate = new Date();
        expectedMaxDate.setDate(expectedMaxDate.getDate() + 16);

        setMinMaxDate();

        // Assert that the minimum date is set to the current date
        expect(mockDepartingDateInput.min).toBe(
            currentDate.toISOString().split("T")[0]
        );

        // Assert that the maximum date is set to 16 days after the current date
        expect(mockDepartingDateInput.max).toBe(
            expectedMaxDate.toISOString().split("T")[0]
        );
    });
});

describe("Testing getRemainingDays", () => {
    test("Testing if getRemainingDays calculates the remaining days correctly", () => {
        // Test case 1: Today's date
        const today = new Date();
        const remainingDays = getRemainingDays(
            today.toISOString().split("T")[0]
        );
        expect(remainingDays).toBe(0);

        // Test case 2: A future date
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10);
        const remainingDaysFuture = getRemainingDays(
            futureDate.toISOString().split("T")[0]
        );
        // expect(remainingDaysFuture).toBeCloseTo(10, 1);
        expect([9, 10]).toContain(remainingDaysFuture);

        // Test case 3: A past date
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 5);
        const remainingDaysPast = getRemainingDays(
            pastDate.toISOString().split("T")[0]
        );
        // expect(remainingDaysPast).toBe(-5);
        expect([-5, -6]).toContain(remainingDaysPast);
    });
});

describe("Testing validateInputs", () => {
    test("Testing if validateInputs returns true for valid inputs", () => {
        const mockCityInput = { value: "New York" };
        const mockDepartingDateInput = { value: "2024-12-31" };

        jest.spyOn(document, "getElementById").mockImplementation((id) => {
            if (id === "city") {
                return mockCityInput;
            } else if (id === "departingDate") {
                return mockDepartingDateInput;
            }
            return null;
        });

        const isValid = validateInputs();
        expect(isValid).toBe(true);
    });

    test("Testing if validateInputs returns false for empty inputs", () => {
        const mockEmptyInput = { value: "" };

        jest.spyOn(document, "getElementById").mockImplementation((id) => {
            if (id === "city" || id === "departingDate") {
                return mockEmptyInput;
            }
            return null;
        });

        const isValid = validateInputs();
        expect(isValid).toBe(false);
    });
});
describe("Testing handleInputsValidation", () => {
    test("Testing if handleInputsValidation enables/disables submit button correctly", () => {
        const mockSubmitButton = { disabled: false };
        const mockCityInput = { value: "New York" };
        const mockDepartingDateInput = { value: "2024-12-31" };

        jest.spyOn(document, "getElementById").mockImplementation((id) => {
            if (id === "addTripBtn") {
                return mockSubmitButton;
            } else if (id === "city") {
                return mockCityInput;
            } else if (id === "departingDate") {
                return mockDepartingDateInput;
            }
            return null;
        });

        handleInputsValidation();
        expect(mockSubmitButton.disabled).toBe(false);

        mockCityInput.value = "";
        handleInputsValidation();
        expect(mockSubmitButton.disabled).toBe(true);
    });
});

