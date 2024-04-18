'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { abi, contractAddress } from '@/constants';
import { useAccount, useContractWrite, useContractRead, usePrepareContractWrite } from 'wagmi';
import { useState } from 'react';

export default function Home() {
  const { isConnected } = useAccount();

  const [voterAddress, setVoterAddress] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposalId, setProposalId] = useState(0);
  const [winner, setWinner] = useState('');

  // Read the winner from the contract
  const readWinner = async () => {
    const { data } = await useContractRead({
      address: contractAddress,
      abi: abi,
      functionName: 'getWinner',
    });
    setWinner(data);
  };

  // Register a voter
  const { write: registerVoter } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'registerVoter',
    args: [voterAddress],
  });

  // Start proposal registration
  const { write: startProposalsRegistration } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'startProposalsRegistration',
  });

  // Submit a proposal
  const { write: submitProposal } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'submitProposal',
    args: [proposalDescription],
  });

  // Start voting session
  const { write: startVotingSession } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'startVotingSession',
  });

  // Vote on a proposal
  const { write: voteForProposal } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'vote',
    args: [proposalId],
  });

  // Tally votes
  const { write: tallyVotes } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'tallyVotes',
  });

  return (
    <>
      <ConnectButton />
      {isConnected ? (
        <div>
          <input placeholder="Voter Address" onChange={(e) => setVoterAddress(e.target.value)} />
          <button onClick={() => registerVoter()}>Register Voter</button>

          <button onClick={() => startProposalsRegistration()}>Start Proposals Registration</button>
          <input placeholder="Proposal Description" onChange={(e) => setProposalDescription(e.target.value)} />
          <button onClick={() => submitProposal()}>Submit Proposal</button>

          <button onClick={() => startVotingSession()}>Start Voting Session</button>
          <input type="number" placeholder="Proposal ID" onChange={(e) => setProposalId(e.target.value)} />
          <button onClick={() => voteForProposal()}>Vote for Proposal</button>

          <button onClick={() => tallyVotes()}>Tally Votes</button>
          <button onClick={readWinner}>Get Winner</button>
          <p>Winner: {winner}</p>
        </div>
      ) : (
        <p>Please connect your Wallet to interact with the DApp.</p>
      )}
    </>
  )
}
