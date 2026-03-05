/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useRef, useState } from 'react';
import { Artifact } from '../types';
import { reviewCode } from '../services/codeReviewService';

interface ArtifactCardProps {
    artifact: Artifact;
    isFocused: boolean;
    onClick: () => void;
}

const ArtifactCard = React.memo(({ 
    artifact, 
    isFocused, 
    onClick 
}: ArtifactCardProps) => {
    const codeRef = useRef<HTMLPreElement>(null);
    const [review, setReview] = useState<string | null>(null);
    const [isReviewing, setIsReviewing] = useState(false);

    // Auto-scroll logic for this specific card
    useEffect(() => {
        if (codeRef.current) {
            codeRef.current.scrollTop = codeRef.current.scrollHeight;
        }
    }, [artifact.html]);

    const isBlurring = artifact.status === 'streaming';

    const handleReview = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsReviewing(true);
        try {
            const result = await reviewCode(artifact.html);
            setReview(result);
        } catch (error) {
            console.error(error);
            setReview("Error during review.");
        } finally {
            setIsReviewing(false);
        }
    };

    return (
        <div 
            className={`artifact-card ${isFocused ? 'focused' : ''} ${isBlurring ? 'generating' : ''}`}
            onClick={onClick}
        >
            <div className="artifact-header">
                <span className="artifact-style-tag">{artifact.styleName}</span>
                <button 
                    onClick={handleReview} 
                    disabled={isReviewing}
                    className="review-button"
                >
                    {isReviewing ? 'Reviewing...' : 'Review Code'}
                </button>
            </div>
            <div className="artifact-card-inner">
                {isBlurring && (
                    <div className="generating-overlay">
                        <pre ref={codeRef} className="code-stream-preview">
                            {artifact.html}
                        </pre>
                    </div>
                )}
                <iframe 
                    srcDoc={artifact.html} 
                    title={artifact.id} 
                    sandbox="allow-scripts allow-forms allow-modals allow-popups allow-presentation allow-same-origin"
                    className="artifact-iframe"
                />
                {review && (
                    <div className="review-overlay">
                        <button onClick={() => setReview(null)}>Close</button>
                        <pre>{review}</pre>
                    </div>
                )}
            </div>
        </div>
    );
});

export default ArtifactCard;
