export default function CheckoutBreadcrumbs({ currentStep }) {
    const steps = [
        { number: 1, label: 'Flight' },
        { number: 2, label: 'Passengers' },
        { number: 3, label: 'Payment' },
        { number: 4, label: 'Success' },
    ];

    return (
        <div className="mb-8 flex items-center gap-3 text-sm">
            {steps.map((step, index) => {
                const isCompleted = step.number < currentStep;
                const isCurrent = step.number === currentStep;

                return (
                    <div
                        key={step.number}
                        className="flex items-center gap-3"
                    >
                        <span
                            className={
                                isCurrent
                                    ? 'font-semibold text-blue-600'
                                    : isCompleted
                                      ? 'text-green-600'
                                      : 'text-gray-400'
                            }
                        >
                            {step.number}. {step.label}
                        </span>

                        {index < steps.length - 1 && (
                            <span className="text-gray-400">→</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
