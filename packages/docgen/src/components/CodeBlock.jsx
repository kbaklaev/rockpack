import React from 'react';
import propTypes from 'prop-types';
import Highlight, { defaultProps } from 'prism-react-renderer';
import {
    LiveProvider,
    LiveEditor,
    LiveError,
    LivePreview
} from 'react-live';
import { mdx } from '@mdx-js/react';

const CodeBlock = ({ children, className, live, render }) => {
    const language = typeof className === 'string' && className.indexOf('language') > 0 ?
        className.replace(/language-/, '') :
        'js';

    if (live) {
        return (
            <div
                style={{
                    backgroundColor: 'rgb(42, 39, 52)',
                    caretColor: 'white'
                }}
            >
                <LiveProvider
                    code={children.trim()}
                    transformCode={code => `/** @jsx mdx */${code}`}
                    scope={{ mdx }}
                >
                    <LivePreview />
                    <LiveEditor />
                    <div style={{ color: 'white' }}>
                        <LiveError />
                    </div>
                </LiveProvider>
            </div>
        );
    }

    if (render) {
        return (
            <div>
                <LiveProvider code={children}>
                    <LivePreview />
                </LiveProvider>
            </div>
        );
    }

    return (
        <Highlight {...defaultProps} code={children.trim()} language={language}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={{ ...style, padding: '20px', overflow: 'auto' }}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
};

CodeBlock.propTypes = {
    children: propTypes.string.isRequired,
    className: propTypes.string,
    live: propTypes.bool,
    render: propTypes.bool
};

export default CodeBlock;
